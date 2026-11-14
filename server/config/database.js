import mongoose from 'mongoose';

// One shared connection. On Netlify, the function reuses it between requests
// instead of reconnecting every time.
let connection;

export function connectDB() {
  connection ??= openConnection().catch((err) => {
    connection = undefined; // try again on the next call
    throw err;
  });
  return connection;
}

async function openConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to server/.env, or to the environment variables on Netlify.');
  }

  // Give up after 8 seconds instead of waiting forever for an unreachable server.
  // This also stays under Netlify's 10-second limit for a function.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });

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
