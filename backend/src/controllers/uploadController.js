// import CV from '../models/cv.model.js';
// import fs from 'fs';
// import  extract  from 'pdf-text-extract';
// import { formatCV } from '../../utils/cvFormatter.js';

// const uploadCV = async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     let extractedText = '';
    
//     // Only process PDF files
//     if (file.mimetype === 'application/pdf') {
//       try {
//         console.log("File path is",file.path);
//         extractedText = await extractTextFromPDF(file.path);
//         console.log('Successfully extracted PDF text');
//       } catch (error) {
//         console.error('PDF extraction error:', error);
//       }
//     }
    
//     // Call OpenAI to format CV
//     let formattedCVJson = {};
//     try {
//       formattedCVJson = await formatCV(extractedText);
//     } catch (error) {
//       console.error("OpenAI formatting error:", error);
//       return res.status(500).json({ message: 'Error formatting CV using AI' });
//     }

//     const newCV = new CV({
//       originalFileName: file.originalname,
//       storedFileName: file.filename,
//       fileType: file.mimetype,
//       filePath: file.path,
//       uploadedBy: req.user.id,
//       extractedText: extractedText,
//     });

//     await newCV.save();

//     res.status(201).json({
//       message: 'CV uploaded successfully',
//       cvId: newCV._id,
//       hasText: extractedText.length > 0,
//       extractedText,
//       formattedCV: formattedCVJson
//     });

//   } catch (err) {
//     console.error('Upload Error:', err);
//     res.status(500).json({ message: 'Server error during file upload' });
//   }
// };

// // Simple, reliable text extraction
// const extractTextFromPDF = (filePath) => {
//   return new Promise((resolve, reject) => {
//     extract(filePath, (err, pages) => {
//       if (err) return reject(err);
//       resolve(pages.join('\n'));
//     });
//   });
// };

// export default uploadCV;

import CV from '../models/cv.model.js';
import fs from 'fs';
import  extract from 'pdf-text-extract';
import { formatCV } from '../../utils/cvFormatter.js';

const uploadCV = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let extractedText = '';
    
    if (file.mimetype === 'application/pdf') {
      try {
        extractedText = await extractTextFromPDF(file.path);
      } catch (error) {
        console.error('PDF extraction error:', error);
      }
    }
    
    // Format with OpenAI
    let formattedCV = {};
    try {
      formattedCV = await formatCV(extractedText);
      
      // Ensure the structure matches the Oliver template
      const standardizedCV = {
        header: {
          name: formattedCV.header?.name || '',
          jobTitle: formattedCV.header?.jobTitle || '',
          photoUrl: formattedCV.header?.photoUrl || ''
        },
        personalDetails: {
          nationality: formattedCV.personalDetails?.nationality || '',
          languages: formattedCV.personalDetails?.languages || '',
          dob: formattedCV.personalDetails?.dob || '',
          maritalStatus: formattedCV.personalDetails?.maritalStatus || ''
        },
        profile: formattedCV.profile || '',
        experience: formattedCV.experience || [],
        education: formattedCV.education || [],
        keySkills: formattedCV.keySkills || [],
        interests: formattedCV.interests || []
      };

      const newCV = new CV({
        originalFileName: file.originalname,
        storedFileName: file.filename,
        fileType: file.mimetype,
        filePath: file.path,
        uploadedBy: req.user.id,
        extractedText: extractedText,
        formattedCV: standardizedCV
      });

      await newCV.save();

      res.status(201).json({
        message: 'CV uploaded successfully',
        cvId: newCV._id,
        hasText: extractedText.length > 0,
        extractedText,
        formattedCV: standardizedCV
      });

    } catch (error) {
      console.error("OpenAI formatting error:", error);
      return res.status(500).json({ message: 'Error formatting CV using AI' });
    }

  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Server error during file upload' });
  }
};

const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    extract(filePath, (err, pages) => {
      if (err) return reject(err);
      resolve(pages.join('\n'));
    });
  });
};

export default uploadCV;