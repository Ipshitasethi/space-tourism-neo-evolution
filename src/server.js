const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Neo-Evolution Backend is live!
  📡 Port: ${PORT}
  🌍 Mode: ${process.env.NODE_ENV || 'development'}
  `);
});

process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
