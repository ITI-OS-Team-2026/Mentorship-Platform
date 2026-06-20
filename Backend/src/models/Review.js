import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorProfile',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'rating must be a whole number from 1 to 5'
    }
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  }
}, { timestamps: true });

reviewSchema.index({ mentor_id: 1, student_id: 1 }, { unique: true });
reviewSchema.index({ mentor_id: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);
