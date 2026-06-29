import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from '../src/models/Session.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mentorship_platform';

async function run(){
  await mongoose.connect(MONGO);
  const mentorId = '6a3be127bbc4a28b92613061';
  const sessions = await Session.find({ mentor_id: mentorId }).lean();
  console.log(JSON.stringify(sessions, null, 2));
  await mongoose.disconnect();
}
run().catch(e=>{ console.error(e); process.exit(1); });
