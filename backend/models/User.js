import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Explicit index for faster lookups
    },
    role: {
      type: String,
      enum: ['PM', 'USER'],
      required: true,
    },
    password: {
      type: String,
      default: 'dummy',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure index is created
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
export default User;
