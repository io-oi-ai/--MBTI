const createApp = require('./app');

const app = createApp();
const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
