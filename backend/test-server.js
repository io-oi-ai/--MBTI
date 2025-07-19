// 简化版服务器用于测试
const express = require('express');
const app = express();
const port = 3008;

app.get('/', (req, res) => {
    res.json({ message: '服务器运行正常！' });
});

app.listen(port, () => {
    console.log(`测试服务器运行在 http://localhost:${port}`);
});