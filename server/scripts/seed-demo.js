import '../config/env.js';
import { hashPassword } from '../utils/password.js';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Prompt from '../models/Prompt.js';

// Demo accounts and sample prompts for testing and the demo video.
// Run with `npm run seed:demo`, which adds the categories first.
// Safe to run more than once: accounts and prompts that already exist are left as they are.

// The repository is public, so the demo password comes from .env, not from this file.
const password = process.env.DEMO_PASSWORD;
if (!password || password.length < 8 || Buffer.byteLength(password) > 72) {
  console.error('Set DEMO_PASSWORD (8 to 72 characters) in server/.env. Every demo account uses this password.');
  process.exit(1);
}

const USERS = [
  { name: 'Alex Chen', email: 'alex.demo@example.com', role: 'member' },
  { name: 'Priya Nair', email: 'priya.demo@example.com', role: 'member' },
  { name: 'Sam Taylor', email: 'sam.demo@example.com', role: 'member' },
  // Can edit or delete any prompt and manage the categories.
  { name: 'Admin Demo', email: 'admin.demo@example.com', role: 'admin' }
];

const PROMPTS = [
  // Coding
  {
    author: 'alex.demo@example.com',
    category: 'Coding',
    platform: 'Code',
    title: 'Explain a function in plain English',
    description: 'Get a short, beginner-friendly explanation of what a piece of code does.',
    content: 'You are a patient programming tutor. Explain what the following function does in plain English for a first-year student. Cover its purpose, its inputs and outputs, and one example call with the result. Keep it under 150 words.\n\nFunction:\n[paste your code here]',
    tags: ['javascript', 'explain', 'beginner']
  },
  {
    author: 'sam.demo@example.com',
    category: 'Coding',
    platform: 'Code',
    title: 'Find the bug',
    description: 'Ask for a step-by-step search for the bug in a short code snippet.',
    content: 'Act as a code reviewer. The code below should [describe what it should do], but instead it [describe what happens]. Find the most likely bug, explain why it happens, and show the corrected code. Do not rewrite parts that already work.\n\nCode:\n[paste your code here]',
    tags: ['debugging', 'code review']
  },
  {
    author: 'priya.demo@example.com',
    category: 'Coding',
    platform: 'Code',
    title: 'Write unit tests for a function',
    description: 'Generate focused unit tests, including edge cases, for one function.',
    content: 'Write unit tests for the function below using [Jest / Mocha / pytest]. Include tests for normal input, empty input, invalid input and at least two edge cases. Give each test a name that says what it checks.\n\nFunction:\n[paste your code here]',
    tags: ['testing', 'jest']
  },

  // Studying
  {
    author: 'priya.demo@example.com',
    category: 'Studying',
    platform: 'Chat',
    title: 'Turn notes into review questions',
    description: 'Creates practice questions, with answers, from your lecture notes.',
    content: 'Turn the notes below into 5 review questions: 3 multiple choice with 4 options each, and 2 short answer. Put all the answers in a separate section at the end so I can test myself first.\n\nNotes:\n[paste your notes here]',
    tags: ['exam prep', 'quiz']
  },
  {
    author: 'alex.demo@example.com',
    category: 'Studying',
    platform: 'Chat',
    title: 'Explain a topic from scratch',
    description: 'Breaks a difficult concept into simple steps with an everyday example.',
    content: 'Explain [topic] to me as if I am new to the subject. Start with a one-sentence summary, explain it in 3 short steps, then give an everyday analogy. Finish with one question I can answer to check my understanding.',
    tags: ['learning', 'concepts']
  },
  {
    author: 'sam.demo@example.com',
    category: 'Studying',
    platform: 'General',
    title: 'Weekly study plan',
    description: 'Builds a realistic study schedule around your courses and deadlines.',
    content: 'Create a study plan for the next [number] weeks. My courses are [list them], my deadlines are [list them], and I can study about [hours] hours on weekdays and [hours] hours on weekends. Show it as a table by day, keep one evening free each week, and schedule a review session before each deadline.',
    tags: ['planning', 'time management']
  },

  // Writing
  {
    author: 'sam.demo@example.com',
    category: 'Writing',
    platform: 'Chat',
    title: 'Rewrite an email professionally',
    description: 'Turns a rough draft into a clear, polite email with a subject line.',
    content: 'Rewrite the email below so it is clear, polite and professional. Keep it under 120 words, keep every important detail, and suggest a short subject line.\n\nDraft:\n[paste your draft here]',
    tags: ['email', 'professional']
  },
  {
    author: 'priya.demo@example.com',
    category: 'Writing',
    platform: 'General',
    title: 'Shorten text without losing meaning',
    description: 'Cuts a paragraph to about half its length while keeping the key points.',
    content: 'Shorten the text below to about half its length. Keep every key fact, remove repetition and filler words, and keep the original tone. Then list in one line what you removed.\n\nText:\n[paste your text here]',
    tags: ['editing', 'concise']
  },
  {
    author: 'alex.demo@example.com',
    category: 'Writing',
    platform: 'Chat',
    title: 'Cover letter outline',
    description: 'Drafts a cover letter outline that matches your experience to a job ad.',
    content: 'Using the job description and my experience below, write an outline for a one-page cover letter: an opening line, three paragraphs that match my experience to the top requirements of the job, and a closing. Use bullet points, not full sentences.\n\nJob description:\n[paste it here]\n\nMy experience:\n[paste it here]',
    tags: ['career', 'cover letter']
  },

  // Images
  {
    author: 'priya.demo@example.com',
    category: 'Images',
    platform: 'Image',
    title: 'Product photo on a clean background',
    description: 'Generates a studio-style product image for a shop or portfolio.',
    content: 'A professional studio photograph of [product] on a seamless light grey background, soft diffused lighting from the left, a gentle shadow underneath, sharp focus, high detail, square format, no text or logos.',
    tags: ['product', 'photography']
  },
  {
    author: 'sam.demo@example.com',
    category: 'Images',
    platform: 'Image',
    title: 'Flat illustration for a slide',
    description: 'Creates a simple, modern illustration with space for text on a presentation slide.',
    content: 'A flat vector illustration of [scene, e.g. students working together on laptops], modern minimal style, a palette of [3 colours], simple shapes, plenty of empty space on the right for text, no words in the image.',
    tags: ['illustration', 'slides']
  },
  {
    author: 'alex.demo@example.com',
    category: 'Images',
    platform: 'Image',
    title: 'App icon concept',
    description: 'Designs a clean icon idea for a mobile or web app.',
    content: 'A modern app icon for an app called [name] that helps people [purpose]. Rounded square, one bold simple symbol in the centre, [colour] gradient background, no text, clear and readable at small sizes.',
    tags: ['icon', 'branding']
  }
];

await connectDB();

const categoryIds = new Map((await Category.find()).map((c) => [c.name, c._id]));
const missing = [...new Set(PROMPTS.map((p) => p.category))].filter((name) => !categoryIds.has(name));
if (missing.length) {
  console.error(`Missing categories: ${missing.join(', ')}. Run "npm run seed" first.`);
  process.exit(1);
}

let usersAdded = 0;
const userIds = new Map();
for (const { name, email, role } of USERS) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, role, passwordHash: await hashPassword(password) });
    usersAdded++;
  }
  userIds.set(email, user._id);
}

let promptsAdded = 0;
for (const { author, category, ...fields } of PROMPTS) {
  const userId = userIds.get(author);
  if (await Prompt.exists({ title: fields.title, userId })) continue;
  await Prompt.create({ ...fields, userId, categoryId: categoryIds.get(category) });
  promptsAdded++;
}

console.log(`Demo accounts: ${usersAdded} added, ${USERS.length - usersAdded} already there.`);
console.log(`Demo prompts: ${promptsAdded} added, ${PROMPTS.length - promptsAdded} already there.`);
console.log(`Log in as ${USERS.map((u) => u.email).join(', ')} with DEMO_PASSWORD.`);
console.log('admin.demo@example.com is an admin.');
process.exit(0);
