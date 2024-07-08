const app = require('./src/app');
const port = parseInt(process.env.PORT as string) || 8080;

const server = app.listen(port, () => {
  console.log(`Court4u start with port ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`));
});
