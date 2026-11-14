// Runs the Express API as a Netlify Function.
// netlify.toml sends every /api/* request here. Locally, server.js runs the same app.
import serverless from 'serverless-http';
import app from '../app.js';
import { connectDB } from '../config/database.js';
import { checkTokenSettings } from '../utils/token.js';

// Same start-up check as server.js. If it fails, the error appears in Netlify's function logs.
checkTokenSettings();

const handleRequest = serverless(app);

export async function handler(event, context) {
  // The Express routes start with /api. Netlify may pass the path as
  // /api/... or as /.netlify/functions/api/..., so make both look the same.
  event.path = event.path.replace(/^\/\.netlify\/functions\/api/, '/api');

  try {
    await connectDB();
  } catch (err) {
    console.error(`Could not connect to MongoDB: ${err.message}`);
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'The database is not available. Please try again later.' })
    };
  }
  return handleRequest(event, context);
}
