import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  originalFileName: {
    type: String,
    required: true,
  },
  storedFileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const CV = mongoose.model('CV', cvSchema);

export default CV;
