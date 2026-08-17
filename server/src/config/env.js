import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/autocare-mini',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
