import mongoose from 'mongoose';

// Platforms the first release accepts. The form can leave this out.
export const PLATFORMS = ['General', 'Chat', 'Code', 'Image'];

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [3, 'Title must be 3 to 100 characters.'],
      maxlength: [100, 'Title must be 3 to 100 characters.']
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      minlength: [10, 'Description must be 10 to 500 characters.'],
      maxlength: [500, 'Description must be 10 to 500 characters.']
    },
    content: {
      type: String,
      required: [true, 'Prompt text is required.'],
      trim: true,
      minlength: [10, 'Prompt text must be 10 to 12000 characters.'],
      maxlength: [12000, 'Prompt text must be 10 to 12000 characters.']
    },
    // Optional. The current form does not send it.
    platform: {
      type: String,
      enum: PLATFORMS,
      default: 'General'
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags) {
          return tags.length <= 8 && tags.every((tag) => tag.length > 0 && tag.length <= 24);
        },
        message: 'Use at most 8 tags, each 1 to 24 characters.'
      }
    },
    // Set from the login token, never from the request body.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

promptSchema.index({ createdAt: -1 });

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;
