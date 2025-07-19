# AI 头像MBTI性格分析小程序

这是一个基于AI的头像MBTI性格分析小程序，通过上传头像图片，AI会分析用户的性格特征并给出MBTI类型判断。

## ✨ 功能特性

- 🤖 **AI智能分析**: 基于Google Gemini AI进行头像分析
- 🎯 **MBTI性格测试**: 专业的16型人格分析
- 📱 **跨平台支持**: 支持H5、微信小程序等多端运行
- 🎨 **精美UI设计**: 现代化的用户界面设计
- ⚡ **快速响应**: 秒级分析结果返回
- 🔒 **隐私保护**: 图片仅用于分析，不存储

## 🛠️ 技术栈

### 前端
- **框架**: Uni-app (Vue3)
- **构建工具**: Vite
- **UI**: 原生CSS + 响应式设计
- **平台**: H5、微信小程序

### 后端
- **运行时**: Node.js
- **框架**: Express.js
- **AI服务**: Google Gemini AI
- **文件处理**: Multer
- **跨域**: CORS

## 📁 项目结构

```
头像分析-MBTI/
├── frontend/                 # Uni-app 前端项目
│   ├── src/
│   │   ├── pages/           # 页面文件
│   │   ├── static/          # 静态资源
│   │   ├── App.vue          # 应用入口
│   │   └── main.js          # 主入口文件
│   ├── package.json         # 前端依赖配置
│   └── vite.config.js       # Vite配置
├── backend/                  # Node.js 后端项目
│   ├── server.js            # 主服务器文件
│   ├── package.json         # 后端依赖配置
│   └── .env                 # 环境变量配置
├── start.sh                 # 一键启动脚本
└── README.md               # 项目说明文档
```

## 🚀 快速开始

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

## 📱 部署到小程序

1. 使用 HBuilderX 打开 `frontend` 目录
2. 在 `manifest.json` 中配置小程序的 `appid`
3. 点击运行到微信小程序
4. 记得在小程序后台配置服务器域名白名单

## 🔌 API 接口文档

### 头像分析接口

**接口地址**: `POST /api/analyze`

**功能描述**: 上传头像图片并返回MBTI性格分析结果

**请求参数**:
- **Content-Type**: `multipart/form-data`
- **参数**:
  - `file`: 图片文件 (支持 jpg, jpeg, png, gif 格式)
  - `gender`: 用户性别 ('male' 或 'female')

**成功响应 (200)**:
```json
{
    "success": true,
    "data": {
        "firstImpression": "INFP - 脑内剧场十级选手🎬",
        "personalitySketch": "哇，你的头像很有故事感哦！这种柔和又带点艺术感的风格，感觉你内心一定有个属于自己的奇幻小宇宙吧？✨ 你可能表面上看起来安安静静，其实共情能力max，对世界有独特的看法。不过有时候会不会想太多，陷入精神内耗呢？🤔 别怕，大胆表达自己，你的世界会更精彩！",
        "hotTake": "是世界的美学观察家，也是温柔的造梦者。",
        "disclaimer": "🔮以上分析纯属AI的"读心术"，仅供娱乐，让你发现更可爱的自己！"
    }
}
```

**错误响应**:
```json
{
    "success": false,
    "error": "错误信息描述"
}
```

### 健康检查接口

**接口地址**: `GET /api/health`

**功能描述**: 检查服务是否正常运行

**响应**:
```json
{
    "status": "ok",
    "message": "AI头像MBTI分析服务运行正常",
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Google Gemini API 密钥

### 开发模式

```bash
# 后端开发模式（自动重启）
cd backend
npm run dev

# 前端开发模式
cd frontend
npm run dev:h5
```

### 构建生产版本

```bash
# 构建前端
cd frontend
npm run build:h5

# 启动后端生产服务
cd backend
npm start
```

## 🐛 常见问题

### Q: 如何获取Google Gemini API密钥？
A: 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)，注册账号后即可免费获取API密钥。

### Q: 支持哪些图片格式？
A: 目前支持 jpg, jpeg, png, gif 格式的图片文件。

### Q: 分析结果准确吗？
A: 这是基于AI的娱乐性分析，仅供参考，不能替代专业的心理测试。

### Q: 图片会被存储吗？
A: 不会，图片仅用于AI分析，分析完成后立即删除。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至项目维护者

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
