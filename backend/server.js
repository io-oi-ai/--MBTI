require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// 初始化 Google AI
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
    },
    fileFilter: (req, file, cb) => {
        // 只允许图片文件
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只支持图片文件！'), false);
        }
    }
});

// 将图片Buffer转换为Google AI需要的格式
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

// 解析AI返回的文本并格式化为JSON
function parseAIResponse(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const result = {};
    lines.forEach(line => {
        if (line.startsWith('【MBTI初印象】：')) {
            result.firstImpression = line.replace('【MBTI初印象】：', '').trim();
        } else if (line.startsWith('【AI性格速写】：')) {
            result.personalitySketch = line.replace('【AI性格速写】：', '').trim();
        } else if (line.startsWith('【一句话总结】：')) {
            result.hotTake = line.replace('【一句话总结】：', '').trim();
        } else if (line.startsWith('【娱乐提示】：')) {
            result.disclaimer = line.replace('【娱乐提示】：', '').trim();
        }
    });
    return result;
}

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/analyze', upload.single('file'), async (req, res) => {
    console.log('收到分析请求...');
    
    if (!req.file) {
        console.log('错误：没有上传文件');
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log('文件信息:', {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });

    try {
        const gender = req.body.gender || 'unknown';
        console.log('用户性别:', gender);
        
        const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);
        console.log('图片转换完成，开始AI分析...');

        const prompt = `你是一个超懂MBTI的AI搭子和心理分析师，尤其擅长通过年轻人的社交媒体头像，洞察他们的隐藏性格。你的分析既有深度又有趣，说话风格轻松、新潮，带点小犀利，就像和朋友聊天一样。

用户性别：${gender === 'male' ? '男生' : '女生'}

分析步骤：
1.  **头像解码**：先仔细看图！这是什么类型的头像？（比如：怼脸自拍、动漫人物、猫猫狗狗、风景、梗图、暗黑系...）
2.  **氛围感拿捏**：头像的整体感觉是啥？（比如：温暖治愈、高冷神秘、搞笑沙雕、文艺清新、赛博朋克...）
3.  **色彩心理学**：主色调是啥？（比如：粉色可能浪漫，黑色可能独立，蓝色可能冷静...）
4.  **性格推测**：结合以上信息和用户性别，大胆推测出最可能的MBTI类型。

输出要求：
*   用亲切、活泼的“小红书”风格来写。
*   多用emoji来增加趣味性！✨🤔💖
*   分析要一针见血，可以带点小吐槽，但整体是积极正向的。
*   **严格按照下面的格式输出，不要添加任何额外解释。**

输出格式：
【MBTI初印象】：xxxx
【AI性格速写】：xxxx
【一句话总结】：xxxx
【娱乐提示】：🔮以上分析纯属AI的“读心术”，仅供娱乐，让你发现更可爱的自己！`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        
        console.log('AI原始响应:', text);
        
        const formattedResult = parseAIResponse(text);
        console.log('格式化后的结果:', formattedResult);

        res.json(formattedResult);

    } catch (error) {
        console.error('Error analyzing image:', error);
        res.status(500).json({ error: 'Failed to analyze image with AI.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
