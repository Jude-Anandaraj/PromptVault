import dotenv from 'dotenv';

// Load variables from server/.env into process.env.
// server.js imports this file first, so every other file can use process.env.
dotenv.config({ quiet: true });
