import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Set a generated JWT_SECRET of at least 32 characters');
if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI to your own database');
await mongoose.connect(process.env.MONGO_URI);
const server = app.listen(Number(process.env.PORT || 5000), process.env.HOST || '0.0.0.0', () => console.log('Clinic API ready'));
async function stop() {
  server.close(async () => {await mongoose.disconnect(); process.exit(0);});
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
