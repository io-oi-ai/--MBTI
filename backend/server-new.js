require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3008;

// 初始化 Google AI
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        const social = req.body.social || 'unknown';
        const decision = req.body.decision || 'unknown';
        const planning = req.body.planning || 'unknown';
        
        console.log('用户信息:', { gender, social, decision, planning });
        
        const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);
        console.log('图片转换完成，开始AI分析...');

        // 根据问卷答案生成性格倾向提示
        const socialTrait = {
            'active': '外向型(E) - 喜欢社交互动',
            'observe': '中间型 - 有选择性的社交',
            'quiet': '内向型(I) - 偏好安静环境'
        }[social] || '';

        const decisionTrait = {
            'logic': '思考型(T) - 理性决策导向',
            'feeling': '情感型(F) - 情感考量导向', 
            'intuition': '直觉型(N) - 直觉导向'
        }[decision] || '';

        const planningTrait = {
            'structured': '判断型(J) - 喜欢结构化',
            'flexible': '中间型 - 平衡计划与灵活',
            'spontaneous': '感知型(P) - 偏好自发性'
        }[planning] || '';

        const prompt = `你是一个超懂MBTI的AI搭子和心理分析师，现在要综合分析用户的头像和性格问卷，给出精准的MBTI分析。

**用户基本信息：**
- 性别：${gender === 'male' ? '男生' : '女生'}

**问卷分析结果：**
- 社交倾向：${socialTrait}
- 决策方式：${decisionTrait}  
- 计划态度：${planningTrait}

**分析任务：**
1. **头像视觉分析**：仔细观察头像的类型、风格、色彩、构图等视觉元素
2. **问卷数据整合**：结合问卷反映的性格倾向
3. **MBTI类型推断**：基于头像+问卷的综合信息，推断最可能的MBTI类型
4. **个性化分析**：针对这个具体的人给出深度的性格洞察

**输出要求：**
- 用轻松、有趣的"小红书"风格
- 多用emoji增加趣味性 ✨🎭💫
- 分析要准确且有针对性
- 可以适当"吐槽"但要积极正向

**严格按照以下格式输出：**
【MBTI初印象】：[具体的MBTI类型] - [有趣的标签]
【AI性格速写】：[结合头像和问卷的深度分析，150字左右]
【一句话总结】：[精炼的性格总结]
【娱乐提示】：🔮以上分析纯属AI的"读心术"，仅供娱乐，让你发现更可爱的自己！`;

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