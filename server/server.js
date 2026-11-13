import './config/env.js';
import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 3000;

try {
  await connectDB();
} catch (err) {
  console.error(`Could not connect to MongoDB: ${err.message}`);
  process.exit(1);
}

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Could not start the server: ${err.message}`);
    process.exit(1);
  }
  console.log(`PromptVault API running at http://localhost:${PORT}`);
});
