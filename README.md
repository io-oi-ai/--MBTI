# AI 头像MBTI性格分析小程序

这是一个基于AI的头像MBTI性格分析小程序，通过上传头像图片，AI会分析用户的性格特征并给出MBTI类型判断。

## ✨ 功能特性

- 🤖 **AI智能分析**: 基于Google Gemini AI进行头像分析
- 🎯 **MBTI性格测试**: 专业的16型人格分析
- 📱 **跨平台支持**: 支持H5、微信小程序等多端运行
- 🎨 **精美UI设计**: 现代化的用户界面设计
- ⚡ **快速响应**: 秒级分析结果返回
- 🔒 **隐私保护**: 图片仅用于分析，不存储

## 项目结构

- `/frontend`: Uni-app (Vue3) 前端项目
- `/backend`: Node.js (Express) 后端项目

## 快速开始

### 方式一：一键启动（推荐）

```bash
# 给启动脚本执行权限
chmod +x start.sh

# 运行启动脚本
./start.sh
```

### 方式二：手动启动

#### 1. 配置API密钥

在 `backend/.env` 文件中配置你的Google Gemini API密钥：

```env
GEMINI_API_KEY=你的API密钥
PORT=3000
```

> 💡 **获取API密钥**: 访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取免费的Gemini API密钥

#### 2. 启动后端服务

```bash
cd backend
npm install
node server.js
```

后端服务将在 `http://localhost:3000` 运行

#### 3. 启动前端服务

```bash
cd frontend
npm install
npm run dev:h5
```

前端将在浏览器中自动打开

## 部署到小程序

1. 使用 HBuilderX 打开 `frontend` 目录
2. 在 `manifest.json` 中配置小程序的 `appid`
3. 点击运行到微信小程序
4. 记得在小程序后台配置服务器域名白名单

## API

### `POST /api/analyze`

用于上传图片并进行分析的接口。

-   **请求:** `multipart/form-data`
    -   `file`: 上传的图片文件

-   **请求:** `multipart/form-data`
    -   `file`: 上传的图片文件
    -   `gender`: 用户选择的性别 ('male' 或 'female')

-   **成功响应 (200):**
    ```json
    {
        "firstImpression": "INFP - 脑内剧场十级选手🎬",
        "personalitySketch": "哇，你的头像很有故事感哦！这种柔和又带点艺术感的风格，感觉你内心一定有个属于自己的奇幻小宇宙吧？✨ 你可能表面上看起来安安静静，其实共情能力max，对世界有独特的看法。不过有时候会不会想太多，陷入精神内耗呢？🤔 别怕，大胆表达自己，你的世界会更精彩！",
        "hotTake": "是世界的美学观察家，也是温柔的造梦者。",
        "disclaimer": "🔮以上分析纯属AI的“读心术”，仅供娱乐，让你发现更可爱的自己！"
    }
    ```
