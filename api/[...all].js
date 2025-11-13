const serverless = require('serverless-http');
const createApp = require('../backend/app');

const app = createApp();

module.exports = serverless(app);
