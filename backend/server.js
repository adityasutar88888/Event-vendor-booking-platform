const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createApp = require('./app');

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secret_key') {
  console.error('Set a real JWT_SECRET in backend/.env before starting the server.');
  process.exit(1);
}

const app = createApp();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`EventEase API running on port ${PORT}`);
  });
});
