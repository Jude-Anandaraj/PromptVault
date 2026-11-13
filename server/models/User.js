import mongoose from 'mongoose';

// Simple check for "something@something.something" with no spaces.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must be 2 to 50 characters.'],
      maxlength: [50, 'Name must be 2 to 50 characters.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, 'Enter a valid email address.'],
      match: [EMAIL_PATTERN, 'Enter a valid email address.']
    },
    // Only the bcrypt hash is stored, never the password itself.
    // select: false leaves it out of query results unless a query asks for it.
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    }
  },
  { timestamps: true }
);

// Shape of a user in every JSON response: "id" instead of "_id",
// and no passwordHash or internal version field.
userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
