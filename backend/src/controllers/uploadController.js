import CV from '../models/cv.model.js';
import fs from 'fs';
import extract from 'pdf-text-extract';
import { formatCV } from '../../utils/cvFormatter.js';

const uploadCV = async (req, res) => {
  try {
    const { resume, ehsForm, userImage } = req.files;

    if (!resume || !ehsForm || !userImage) {
      return res.status(400).json({
        message: 'Please upload all files: resume, EHS form, and profile image'
      });
    }

    // Store file paths for cleanup
    const filesToCleanup = [
      resume[0].path,
      ehsForm[0].path,
      userImage[0].path
    ];

    // Text extraction from PDFs
    let resumeText = '';
    let ehsFormText = '';

    try {
      // Extract text from resume PDF
      if (resume[0].mimetype === 'application/pdf') {
        resumeText = await extractTextFromPDF(resume[0].path);
      }

      // Extract text from EHS form PDF
      if (ehsForm[0].mimetype === 'application/pdf') {
        ehsFormText = await extractTextFromPDF(ehsForm[0].path);
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      cleanupFiles(filesToCleanup);
      return res.status(500).json({ message: 'Error extracting text from PDFs' });
    }

    // Format combined data using OpenAI
    let formattedCV;
    try {
      formattedCV = await formatCV(resumeText, ehsFormText);
      
      // Add EHS footer and user image
      formattedCV.footer = "Exclusive Household Staff & Nannies\nwww.exclusivehouseholdstaff.com\nTelephone: +44 (0) 203 358 7000";
      formattedCV.header.photoUrl = userImage[0].path;

      // Create new CV document with flat structure
      const newCV = new CV({
        // Resume Fields
        resumeOriginalName: resume[0].originalname,
        resumeStoredName: resume[0].filename,
        resumeFileType: resume[0].mimetype,
        resumeFilePath: resume[0].path,
        
        // EHS Form Fields
        ehsOriginalName: ehsForm[0].originalname,
        ehsStoredName: ehsForm[0].filename,
        ehsFileType: ehsForm[0].mimetype,
        ehsFilePath: ehsForm[0].path,
        
        // User Image Fields
        imageOriginalName: userImage[0].originalname,
        imageStoredName: userImage[0].filename,
        imageFileType: userImage[0].mimetype,
        imageFilePath: userImage[0].path,
        
        // Common Fields
        uploadedBy: req.user.id,
        extractedText: {
          resume: resumeText,
          ehsForm: ehsFormText
        },
        formattedCV: formattedCV
      });

      await newCV.save();

      // Delete files after successful processing and storage
      cleanupFiles(filesToCleanup);

      res.status(201).json({
        message: 'Files uploaded successfully',
        cvId: newCV._id,
        formattedCV: formattedCV
      });

    } catch (error) {
      console.error("CV formatting error:", error);
      cleanupFiles(filesToCleanup);
      return res.status(500).json({ message: 'Error formatting CV data' });
    }

  } catch (err) {
    console.error('Upload Error:', err);
    
    // Cleanup files if error occurs
    if (req.files) {
      cleanupFiles([
        ...(req.files.resume ? req.files.resume.map(f => f.path) : []),
        ...(req.files.ehsForm ? req.files.ehsForm.map(f => f.path) : []),
        ...(req.files.userImage ? req.files.userImage.map(f => f.path) : [])
      ]);
    }
    
    res.status(500).json({ 
      message: 'Server error during upload',
      error: err.message 
    });
  }
};

// Helper function for PDF text extraction
const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    extract(filePath, (err, pages) => {
      if (err) reject(err);
      resolve(pages.join('\n'));
    });
  });
};

// Helper function to clean up files
const cleanupFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  });
};

export default uploadCV;
// import CV from '../models/cv.model.js';
// import fs from 'fs';
// import extract from 'pdf-text-extract';
// import { formatCV } from '../../utils/cvFormatter.js';

// const uploadCV = async (req, res) => {
//   try {
//     const { resume, ehsForm, userImage } = req.files;

//     if (!resume || !ehsForm || !userImage) {
//       return res.status(400).json({
//         message: 'Please upload all files: resume, EHS form, and profile image'
//       });
//     }

//     // Text extraction from PDFs
//     let resumeText = '';
//     let ehsFormText = '';

//     try {
//       // Extract text from resume PDF
//       if (resume[0].mimetype === 'application/pdf') {
//         resumeText = await extractTextFromPDF(resume[0].path);
//       }

//       // Extract text from EHS form PDF
//       if (ehsForm[0].mimetype === 'application/pdf') {
//         ehsFormText = await extractTextFromPDF(ehsForm[0].path);
//       }
//     } catch (error) {
//       console.error('PDF extraction error:', error);
//       return res.status(500).json({ message: 'Error extracting text from PDFs' });
//     }

//     // Format combined data using OpenAI
//     let formattedCV;
//     try {
//       formattedCV = await formatCV(resumeText, ehsFormText);
      
//       // Add EHS footer and user image
//       formattedCV.footer = "Exclusive Household Staff & Nannies\nwww.exclusivehouseholdstaff.com\nTelephone: +44 (0) 203 358 7000";
//       formattedCV.header.photoUrl = userImage[0].path;

//       // Create new CV document with flat structure
//       const newCV = new CV({
//         // Resume Fields
//         resumeOriginalName: resume[0].originalname,
//         resumeStoredName: resume[0].filename,
//         resumeFileType: resume[0].mimetype,
//         resumeFilePath: resume[0].path,
        
//         // EHS Form Fields
//         ehsOriginalName: ehsForm[0].originalname,
//         ehsStoredName: ehsForm[0].filename,
//         ehsFileType: ehsForm[0].mimetype,
//         ehsFilePath: ehsForm[0].path,
        
//         // User Image Fields
//         imageOriginalName: userImage[0].originalname,
//         imageStoredName: userImage[0].filename,
//         imageFileType: userImage[0].mimetype,
//         imageFilePath: userImage[0].path,
        
//         // Common Fields
//         uploadedBy: req.user.id,
//         extractedText: {
//           resume: resumeText,
//           ehsForm: ehsFormText
//         },
//         formattedCV: formattedCV
//       });

//       await newCV.save();

//       res.status(201).json({
//         message: 'Files uploaded successfully',
//         cvId: newCV._id,
//         formattedCV: formattedCV
//       });

//     } catch (error) {
//       console.error("CV formatting error:", error);
//       return res.status(500).json({ message: 'Error formatting CV data' });
//     }

//   } catch (err) {
//     console.error('Upload Error:', err);
    
//     // Cleanup files if error occurs
//     if (req.files) {
//       Object.values(req.files).forEach(files => {
//         files.forEach(file => {
//           if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
//         });
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Server error during upload',
//       error: err.message 
//     });
//   }
// };

// // Helper function for PDF text extraction
// const extractTextFromPDF = (filePath) => {
//   return new Promise((resolve, reject) => {
//     extract(filePath, (err, pages) => {
//       if (err) reject(err);
//       resolve(pages.join('\n'));
//     });
//   });
// };

// export default uploadCV;