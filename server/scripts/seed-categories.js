import '../config/env.js';
import { connectDB } from '../config/database.js';
import Category from '../models/Category.js';

// Ordinary starter labels for the Explore filters.
// Safe to run more than once: existing names are left as they are.
const STARTERS = [
  { name: 'Writing', description: 'Prompts for drafts, emails, and short explanations.' },
  { name: 'Studying', description: 'Prompts for notes, quizzes, and review.' },
  { name: 'Coding', description: 'Prompts for reading and explaining code.' },
  { name: 'Images', description: 'Prompts that describe a picture to generate.' }
];

await connectDB();

for (const item of STARTERS) {
  const exists = await Category.exists({ name: item.name });
  if (!exists) await Category.create(item);
}

const names = await Category.find().sort({ name: 1 }).select('name');
console.log(names.map((row) => row.name).join(', '));
process.exit(0);
