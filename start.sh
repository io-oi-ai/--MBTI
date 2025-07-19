#!/bin/bash

echo "🚀 启动AI头像MBTI性格分析项目"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "📦 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🔧 检查环境配置..."
if [ ! -f ".env" ] || grep -q "YOUR_API_KEY_HERE" .env; then
    echo "⚠️  请在 backend/.env 文件中配置你的 Google Gemini API 密钥"
    echo "   获取地址：https://makersuite.google.com/app/apikey"
    echo ""
fi

echo "🖥️  启动后端服务..."
node server.js &
BACKEND_PID=$!

cd ../frontend

echo "📦 安装前端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🌐 启动前端服务..."
npm run dev:h5 &
FRONTEND_PID=$!

echo ""
echo "✅ 项目启动完成！"
echo "📱 前端地址：http://localhost:3000"
echo "🔧 后端API：http://localhost:3000/api"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait