import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
