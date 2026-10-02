import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
await mongoose.connect(process.env.MONGODB_URI);
const r = await mongoose.connection.db.collection('appointments').updateOne(
  { _id: new mongoose.Types.ObjectId('6abe46b1810c412dbb5b243a') },
  { $set: { status: 'CANCELLED' } }
);
console.log('Modified:', r.modifiedCount, '| CANCELLED');
await mongoose.disconnect();
