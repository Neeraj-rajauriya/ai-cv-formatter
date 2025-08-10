// import mongoose from 'mongoose';

// const cvSchema = new mongoose.Schema({
//   originalFileName: {
//     type: String,
//     required: true,
//   },
//   storedFileName: {
//     type: String,
//     required: true,
//   },
//   fileType: {
//     type: String,
//     required: true,
//   },
//   filePath: {
//     type: String,
//     required: true,
//   },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   uploadedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const CV = mongoose.model('CV', cvSchema);

// export default CV;


import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  // Resume Fields
  resumeOriginalName: { type: String, required: true },
  resumeStoredName: { type: String, required: true },
  resumeFileType: { type: String, required: true },
  resumeFilePath: { type: String, required: true },
  
  // EHS Form Fields
  ehsOriginalName: { type: String, required: true },
  ehsStoredName: { type: String, required: true },
  ehsFileType: { type: String, required: true },
  ehsFilePath: { type: String, required: true },
  
  // User Image Fields
  imageOriginalName: { type: String, required: true },
  imageStoredName: { type: String, required: true },
  imageFileType: { type: String, required: true },
  imageFilePath: { type: String, required: true },
  
  // Common Fields
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  extractedText: {
    resume: { type: String, default: '' },
    ehsForm: { type: String, default: '' }
  },
  formattedCV: { type: Object, default: {} },
  uploadedAt: { type: Date, default: Date.now }
});

const CV = mongoose.model('CV', cvSchema);

export default CV;