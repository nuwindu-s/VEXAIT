import app from '../backend/index.js';
import { connectDB } from '../backend/config/db.js';

// Pre-warm DB connection on serverless cold start
connectDB().catch((err) => {
  console.error('Serverless cold start DB connection error:', err);
});

export default app;

