import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('================================================================');
    console.error('ERROR: MONGODB_URI environment variable is not defined.');
    console.error('Please configure MONGODB_URI in your server/.env file.');
    console.error('See server/.env.example for guidance.');
    console.error('================================================================');
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'tattoo_booking',
      tlsAllowInvalidCertificates: true
    });
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Atlas] Connection event error: ${err.message}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Atlas] Disconnected. Reconnecting...');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB Atlas] Reconnected successfully.');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB Atlas] Connection error: ${error.message}`);
    throw error;
  }
};
