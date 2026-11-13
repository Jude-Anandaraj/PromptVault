import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and add your connection string.');
  }

  // Give up after 10 seconds instead of waiting forever for an unreachable server.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  // Log the host and database name only. The full URI can contain a password.
  const { host, name } = mongoose.connection;
  console.log(`MongoDB connected: ${host}/${name}`);

  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => console.error(`MongoDB error: ${err.message}`));
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
