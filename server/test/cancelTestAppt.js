// One-shot script: cancel an appointment by ID and verify cancelled status excludes slot
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

await mongoose.connect(process.env.MONGODB_URI);

const TARGET_ID = '6abe44623c9b431e83555f89';

const before = await mongoose.connection.db.collection('appointments').findOne({
  _id: new mongoose.Types.ObjectId(TARGET_ID)
});
console.log('Before status:', before?.status, '| startTime:', before?.startTime, '| endTime:', before?.endTime);

const result = await mongoose.connection.db.collection('appointments').updateOne(
  { _id: new mongoose.Types.ObjectId(TARGET_ID) },
  { $set: { status: 'CANCELLED' } }
);
console.log('Modified:', result.modifiedCount);

const after = await mongoose.connection.db.collection('appointments').findOne({
  _id: new mongoose.Types.ObjectId(TARGET_ID)
});
console.log('After status:', after?.status);

await mongoose.disconnect();
console.log('Done.');
