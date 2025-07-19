// API测试脚本
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3000/api';

// 测试健康检查
async function testHealth() {
    console.log('🔍 测试健康检查...');
    try {
        const response = await axios.get(`${API_BASE}/health`);
        console.log('✅ 健康检查通过:', response.data);
        return true;
    } catch (error) {
        console.log('❌ 健康检查失败:', error.message);
        return false;
    }
}

// 测试图片分析API
async function testAnalyze() {
    console.log('🔍 测试图片分析API...');
    
    // 创建一个测试用的简单图片数据
    const testImagePath = path.join(__dirname, 'test-image.txt');
    
    // 如果没有测试图片，创建一个提示文件
    if (!fs.existsSync(testImagePath)) {
        fs.writeFileSync(testImagePath, '请将测试图片放在这里，命名为 test-image.jpg');
        console.log('❌ 请先在 backend 目录下放置测试图片 test-image.jpg');
        return false;
    }

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream('test-image.jpg'));
        form.append('gender', 'male');

        const response = await axios.post(`${API_BASE}/analyze`, form, {
            headers: {
                ...form.getHeaders(),
            },
            timeout: 30000, // 30秒超时
        });

        console.log('✅ 分析成功:', response.data);
        return true;
    } catch (error) {
        console.log('❌ 分析失败:', error.response?.data || error.message);
        return false;
    }
}

// 主测试函数
async function runTests() {
    console.log('🚀 开始API测试...\n');
    
    const healthOk = await testHealth();
    console.log('');
    
    if (healthOk) {
        await testAnalyze();
    } else {
        console.log('⚠️ 服务器未启动，跳过API测试');
    }
    
    console.log('\n✨ 测试完成！');
}

// 运行测试
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testHealth, testAnalyze };