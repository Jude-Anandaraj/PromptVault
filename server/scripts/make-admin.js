import '../config/env.js';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Gives an existing account the admin role, in the database from MONGODB_URI:
//   npm run make-admin -- someone@example.com
// Add --remove to make the account a normal member again.
const email = process.argv[2]?.trim().toLowerCase();
const role = process.argv.includes('--remove') ? 'member' : 'admin';
if (!email || email.startsWith('--')) {
  console.error('Usage: npm run make-admin -- someone@example.com [--remove]');
  process.exit(1);
}

await connectDB();

const user = await User.findOne({ email });
if (!user) {
  console.error(`No account uses the email ${email}.`);
  process.exit(1);
}
user.role = role;
await user.save();
console.log(`${user.name} (${user.email}) is now ${role === 'admin' ? 'an admin' : 'a member'}.`);
process.exit(0);
