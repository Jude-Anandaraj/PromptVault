import mongoose from 'mongoose';

// A category is a label the Explore page can filter on.
// The React app currently sends and receives the name as plain text.
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be 2 to 40 characters.'],
      maxlength: [40, 'Category name must be 2 to 40 characters.']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description must be 200 characters or less.'],
      default: ''
    }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
