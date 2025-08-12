'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import AuthWrapper from '../authWrapper.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export default function Dashboard() {
  const router = useRouter();
  const [files, setFiles] = useState({
    resume: null,
    ehsForm: null,
    userImage: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formattedResume, setFormattedResume] = useState(null);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (type) => (e) => {
    setFiles(prev => ({
      ...prev,
      [type]: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.resume || !files.ehsForm || !files.userImage) {
      setError('Please select all required files');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const formData = new FormData();
      formData.append('resume', files.resume);
      formData.append('ehsForm', files.ehsForm);
      formData.append('userImage', files.userImage);

      const response = await fetch(`${api_url}/cv/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      setFormattedResume(result.formattedCV);
    } catch (err) {
      setError(err.message || 'Failed to upload files');
      console.error('Upload error:', err);
      
      if (err.message.includes('token')) {
        localStorage.removeItem('token');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (formattedResume) {
    return <ResumeDisplay data={formattedResume} />;
  }

  return (
    <AuthWrapper>
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/title.png"
                alt="Exclusive Household Staff"
                width={180}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/');
                }}
                className="text-rose-500 hover:text-rose-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Documents</h1>
            <p className="text-gray-600">Get your CV professionally formatted in seconds</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Upload */}
              <div className="border-2 border-dashed border-rose-300 rounded-xl p-6 text-center bg-rose-50">
                <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                  <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span className="text-gray-600 font-medium">Resume/CV</span>
                  <span className="text-sm text-gray-500">
                    {files.resume ? files.resume.name : 'Select PDF file'}
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFileChange('resume')}
                    className="hidden"
                    accept=".pdf"
                    required
                  />
                </label>
              </div>

              {/* EHS Form Upload */}
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-blue-50">
                <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="text-gray-600 font-medium">EHS Application Form</span>
                  <span className="text-sm text-gray-500">
                    {files.ehsForm ? files.ehsForm.name : 'Select PDF file'}
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFileChange('ehsForm')}
                    className="hidden"
                    accept=".pdf"
                    required
                  />
                </label>
              </div>

              {/* Profile Image Upload */}
              <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center bg-green-50">
                <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-600 font-medium">Profile Photo</span>
                  <span className="text-sm text-gray-500">
                    {files.userImage ? files.userImage.name : 'Select image file'}
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFileChange('userImage')}
                    className="hidden"
                    accept="image/*"
                    required
                  />
                </label>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Supported formats: PDF for documents, JPG/PNG for images (Max 5MB each)
              </div>

              <button
                type="submit"
                disabled={isLoading || !files.resume || !files.ehsForm || !files.userImage}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-70"
              >
                {isLoading ? 'Processing...' : 'Format My CV'}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
    </AuthWrapper>
  );
}

function ResumeDisplay({ data }) {
  const router = useRouter();
  const resumeRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

const downloadPDF = async () => {
  setIsGeneratingPDF(true);
  
  try {
    const element = resumeRef.current;
    if (!element) throw new Error('Resume element not found');

    // Create exact clone with fixed dimensions
    const clone = element.cloneNode(true);
    clone.id = 'resume-clone';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = '210mm';
    document.body.appendChild(clone);

    const options = {
      scale: 3, // Ultra-high resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: true,
      quality: 1,
      letterRendering: true,
      onclone: (clonedDoc) => {
        // Lock all elements in place
        const style = document.createElement('style');
        style.innerHTML = `
          .resume-page {
            position: relative !important;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }
          .footer {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 210mm !important;
            padding: 2mm 15mm !important;
          }
          img {
            max-width: none !important;
            height: auto !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `;
        clonedDoc.head.appendChild(style);
        
        // Ensure images load properly
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          img.style.maxWidth = 'none';
          img.style.height = 'auto';
          if (!img.src.startsWith('data:')) {
            img.crossOrigin = 'Anonymous';
          }
        });
      }
    };

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      hotfixes: [],
      compress: false
    });

    const pages = clone.querySelectorAll('.resume-page');
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // Ensure footer stays at bottom
      const content = page.querySelector('.page-content');
      const footer = page.querySelector('.footer');
      
      if (content && footer) {
        content.style.paddingBottom = `${footer.offsetHeight}px`;
      }

      const canvas = await html2canvas(page, options);
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (i > 0) pdf.addPage();
      
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'NONE');
    }

    pdf.save(`${data.header.name.replace(/\s+/g, '_')}_CV.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDF download failed. Please try again.');
  } finally {
    const clone = document.getElementById('resume-clone');
    if (clone) document.body.removeChild(clone);
    setIsGeneratingPDF(false);
  }
};

  const renderLogos = () => (
    <div className="flex justify-between mb-4" style={{ height: '25mm' }}> {/* Fixed height */}
  <div className="w-1/2 h-full relative"> {/* Takes half width */}
    <img
      src="/title.png"
      alt="Company Logo"
      className="h-full w-auto object-contain object-left"
      style={{ maxHeight: '15mm' }} // Adjusted max height
      crossOrigin="anonymous"
    />
  </div>
  <div className="w-1/2 h-full relative"> {/* Takes half width */}
    <img
      src="/title_2.png"
      alt="Company Logo"
      className="h-full w-auto object-contain object-right"
      style={{ maxHeight: '15mm' }} // Adjusted max height
      crossOrigin="anonymous"
    />
  </div>
</div>
  );

  const renderPersonalDetails = () => (
    <div className="text-center space-y-1 mb-4" style={{ fontFamily: 'Palatino Linotype', fontSize: '0.9rem' }}>
      {data.personalDetails.nationality && (
        <div>
          <h3 className="font-semibold">Nationality: {data.personalDetails.nationality}</h3>
        </div>
      )}
      {data.personalDetails.languages && (
        <div>
          <h3 className="font-semibold">Languages: {Array.isArray(data.personalDetails.languages) 
            ? data.personalDetails.languages.join(', ')
            : data.personalDetails.languages}</h3>
        </div>
      )}
      {data.personalDetails.dob && (
        <div>
          <h3 className="font-semibold">Date of Birth: {data.personalDetails.dob}</h3>
        </div>
      )}
      {data.personalDetails.maritalStatus && (
        <div>
          <h3 className="font-semibold">Marital Status: {data.personalDetails.maritalStatus}</h3>
        </div>
      )}
      <div>
        <h3 className="font-semibold">Non-Smoker</h3>
      </div>
      {data.personalDetails.drivingLicense && (
        <div>
          <h3 className="font-semibold">Full Driving Licence</h3>
        </div>
      )}
    </div>
  );

  const renderProfileImage = () => (
    <div className="mx-auto w-[3.5cm] h-[3.5cm] overflow-hidden my-3 relative">
      <img
        src={data.header.photoUrl ? `http://localhost:5000/${data.header.photoUrl.replace(/\\/g, '/')}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnpNMTIgNWMxLjgyNyAwIDMuMzMxIDEuNDk2IDMuMzMxIDMuMzMxUzEzLjgyNyAxMS42NjIgMTIgMTEuNjYyIDguNjY5IDEwLjE2NiA4LjY2OSA4LjMzMSAxMC4xNzMgNSAxMiA1ek0xMiAxOWMtMy4xNTIgMC01LjgxMS0xLjYxNy03LjQxLTQuMjY3QzUuMDMxIDE0LjY1NiA4LjE4OCAxMyA5LjUgMTNjMS4wNzggMCAzIDIgNC41IDJzMy40MjItMiA0LjUtMmMxLjMxMiAwIDQuNDY5IDEuNjU2IDQuOTEgMS43MzNDMTcuODExIDE3LjM4MyAxNS4xNTIgMTkgMTIgMTl6Ii8+PC9zdmc+'}
        alt="Profile"
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnpNMTIgNWMxLjgyNyAwIDMuMzMxIDEuNDk2IDMuMzMxIDMuMzMxUzEzLjgyNyAxMS42NjIgMTIgMTEuNjYyIDguNjY5IDEwLjE2NiA4LjY2OSA4LjMzMSAxMC4xNzMgNSAxMiA1ek0xMiAxOWMtMy4xNTIgMC01LjgxMS0xLjYxNy03LjQxLTQuMjY3QzUuMDMxIDE0LjY1NiA4LjE4OCAxMyA5LjUgMTNjMS4wNzggMCAzIDIgNC41IDJzMy40MjItMiA0LjUtMmMxLjMxMiAwIDQuNDY5IDEuNjU2IDQuOTEgMS43MzNDMTcuODExIDE3LjM4MyAxNS4xNTIgMTkgMTIgMTl6Ii8+PC9zdmc+';
        }}
      />
    </div>
  );

  const renderExperience = (experiences, title = "Experience") => (
    <div className="mb-4" style={{ fontFamily: 'Palatino Linotype' }}>
      <h2 className="text-lg font-bold  border-black mb-2">{title}</h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-start">
            <div className="w-1/4 pr-3">
              <p className="text-xs">{exp.dates}</p>
            </div>
            <div className="w-3/4">
              <h3 className="font-bold text-base">{exp.jobTitle}</h3>
              <p className="italic text-sm mb-1">{exp.company} | {exp.location}</p>
              <ul className="list-disc pl-4 space-y-0.5 text-sm">
                {exp.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-4" style={{ fontFamily: 'Palatino Linotype' }}>
      <h2 className="text-lg font-bold  border-black mb-2">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-2">
          <div className="flex items-start">
            <div className="w-1/4 pr-3">
              <p className="text-xs">{edu.dates}</p>
            </div>
            <div className="w-3/4">
              <h3 className="font-bold text-base">{edu.institution}</h3>
              <p className="italic text-sm">{edu.degree}</p>
              {edu.location && <p className="text-xs">{edu.location}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-4" style={{ fontFamily: 'Palatino Linotype' }}>
      <h2 className="text-lg font-bold  border-black mb-2">Key Skills</h2>
      <ul className="list-disc pl-4 space-y-0.5 text-sm">
        {data.keySkills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );

  const renderInterests = () => (
    data.interests?.length > 0 && (
      <div className="mb-4" style={{ fontFamily: 'Palatino Linotype' }}>
        <h2 className="text-lg font-bold  border-black mb-2">Interests</h2>
        <ul className="list-disc pl-4 space-y-0.5 text-sm">
          {data.interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </div>
    )
  );

  const renderHeader = () => (
    <div className="relative pb-2" style={{ fontFamily: 'Palatino Linotype' }}>
      <div className="text-center mb-1">
        <h1 className="text-2xl font-bold uppercase">{data.header.name}</h1>
        <h2 className="text-lg font-medium">{data.header.jobTitle}</h2>
      </div>
      {renderProfileImage()}
      {renderPersonalDetails()}
    </div>
  );

  const renderFooter = () => (
    <div 
      className="absolute bottom-0 left-0 right-0 py-2 text-center text-xs"
      style={{ 
        fontFamily: 'Palatino Linotype',
        width: '210mm',
        margin: '0 auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        backgroundColor: '#59070e',
        color: 'white'
      }}
    >
      Exclusive Household Staff & Nannies<br />
       <a 
    href="https://www.exclusivehouseholdstaff.com" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{
      color: 'white',
      textDecoration: 'none',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
  >
    www.exclusivehouseholdstaff.com
  </a><br />
      Telephone: +44 (0) 203 358 7000
    </div>
  );

  const renderPages = () => (
    <div className="space-y-4 bg-gray-200 p-4">
      {/* Page 1 */}
      <div 
        className="resume-page pdf-page relative bg-white shadow-md mx-auto" 
        style={{ 
          height: '1123px',
          width: '210mm',
          position: 'relative',
          overflow: 'hidden',
          padding: '1.5rem'
        }}
      >
        <div className="pb-12">
          {renderLogos()}
          {renderHeader()}
          <div className="mb-4">
            <h2 className="text-lg font-bold  border-black mb-2">Profile</h2>
            <p className="text-justify text-sm">{data.profile}</p>
          </div>
          {renderExperience(data.experience.slice(0, 2))}
        </div>
        {renderFooter()}
      </div>

      {/* Page 2 */}
      <div 
        className="resume-page pdf-page relative bg-white shadow-md mx-auto" 
        style={{ 
          height: '1123px',
          width: '210mm',
          position: 'relative',
          overflow: 'hidden',
          padding: '1.5rem'
        }}
      >
        <div className="pb-12">
          {renderLogos()}
          {data.experience.length > 2 && renderExperience(data.experience.slice(2), "Experience (cont.)")}
          {renderEducation()}
          {renderSkills()}
          {renderInterests()}
        </div>
        {renderFooter()}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div ref={resumeRef} className="max-w-4xl mx-auto">
        {renderPages()}

        <div className="bg-gray-50 px-6 py-3 border-t flex justify-end space-x-3 mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md transition-colors duration-200 text-sm"
            disabled={isGeneratingPDF}
          >
            Back
          </button>
          <button
            onClick={downloadPDF}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-md transition-colors duration-200 text-sm"
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

// function ResumeDisplay({ data }) {
//   const router = useRouter();
//   const resumeRef = useRef(null);
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

//   const downloadPDF = async () => {
//     setIsGeneratingPDF(true);
    
//     try {
//       const element = resumeRef.current;
//       if (!element) throw new Error('Resume element not found');

//       const tempContainer = document.createElement('div');
//       tempContainer.style.position = 'absolute';
//       tempContainer.style.left = '-9999px';
//       tempContainer.style.width = `${element.offsetWidth}px`;
//       tempContainer.innerHTML = element.innerHTML;
//       document.body.appendChild(tempContainer);

//       const options = {
//         scale: 2, // Increased scale for better quality
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: '#ffffff',
//         logging: true,
//         quality: 1,
//         onclone: (clonedDoc) => {
//           // Remove visual indicators for PDF
//           const indicators = clonedDoc.querySelectorAll('.page-indicator');
//           indicators.forEach(ind => ind.remove());
          
//           const images = clonedDoc.querySelectorAll('img');
//           images.forEach((img) => {
//             if (img.src.includes('uploads')) {
//               img.src = `http://localhost:5000/${img.src.replace(/.*uploads/, 'uploads')}`;
//             }
//             img.crossOrigin = 'Anonymous';
//             img.style.maxWidth = '100%';
//           });
          
//           const buttons = clonedDoc.querySelectorAll('button');
//           buttons.forEach(button => button.remove());
//         },
//       };

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4',
//         hotfixes: ['px_scaling'],
//         compress: true
//       });

//       // Process each page separately
//       const pages = element.querySelectorAll('.pdf-page');
      
//       for (let i = 0; i < pages.length; i++) {
//         const canvas = await html2canvas(pages[i], options);
//         const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
//         if (i > 0) {
//           pdf.addPage();
//         }
        
//         const imgWidth = pdf.internal.pageSize.getWidth();
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
//         pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
//       }

//       pdf.save(`${data.header.name.replace(/\s+/g, '_')}_CV.pdf`);
//     } catch (error) {
//       console.error('PDF generation error:', error);
//       alert('Failed to generate PDF. Please try again.');
//     } finally {
//       const tempContainer = document.querySelector('#temp-pdf-container');
//       if (tempContainer) {
//         document.body.removeChild(tempContainer);
//       }
//       setIsGeneratingPDF(false);
//     }
//   };

//   const renderLogos = () => (
//     <div className="flex justify-between mb-6">
//       <div className="w-48 h-24 relative">
//         <img
//           src="/title.png"
//           alt="Company Logo"
//           className="h-full w-auto object-contain object-left"
//           crossOrigin="anonymous"
//         />
//       </div>
//       <div className="w-48 h-24 relative">
//         <img
//           src="/title_2.png"
//           alt="Company Logo"
//           className="h-full w-auto object-contain object-right"
//           crossOrigin="anonymous"
//         />
//       </div>
//     </div>
//   );

//   const renderPersonalDetails = () => (
//     <div className="text-center space-y-2 mb-6" style={{ fontFamily: 'Palatino Linotype' }}>
//       {data.personalDetails.nationality && (
//         <div>
//           <h3 className="font-semibold">Nationality: {data.personalDetails.nationality}</h3>
//         </div>
//       )}
//       {data.personalDetails.languages && (
//         <div>
//           <h3 className="font-semibold">Languages: {Array.isArray(data.personalDetails.languages) 
//             ? data.personalDetails.languages.join(', ')
//             : data.personalDetails.languages}</h3>
//         </div>
//       )}
//       {data.personalDetails.dob && (
//         <div>
//           <h3 className="font-semibold">Date of Birth: {data.personalDetails.dob}</h3>
//         </div>
//       )}
//       {data.personalDetails.maritalStatus && (
//         <div>
//           <h3 className="font-semibold">Marital Status: {data.personalDetails.maritalStatus}</h3>
//         </div>
//       )}
//       <div>
//         <h3 className="font-semibold">Non-Smoker</h3>
//       </div>
//       {data.personalDetails.drivingLicense && (
//         <div>
//           <h3 className="font-semibold">Full Driving Licence</h3>
//         </div>
//       )}
//     </div>
//   );

//   const renderProfileImage = () => {
//     const profileImageUrl = data.header.photoUrl?.replace(/\\/g, '/');
//     const dummyImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnpNMTIgNWMxLjgyNyAwIDMuMzMxIDEuNDk2IDMuMzMxIDMuMzMxUzEzLjgyNyAxMS42NjIgMTIgMTEuNjYyIDguNjY5IDEwLjE2NiA4LjY2OSA4LjMzMSAxMC4xNzMgNSAxMiA1ek0xMiAxOWMtMy4xNTIgMC01LjgxMS0xLjYxNy03LjQxLTQuMjY3QzUuMDMxIDE0LjY1NiA4LjE4OCAxMyA5LjUgMTNjMS4wNzggMCAzIDIgNC41IDJzMy40MjItMiA0LjUtMmMxLjMxMiAwIDQuNDY5IDEuNjU2IDQuOTEgMS43MzNDMTcuODExIDE3LjM4MyAxNS4xNTIgMTkgMTIgMTl6Ii8+PC9zdmc+';

//     return (
//       <div className="mx-auto w-[4.7cm] h-[4.7cm] overflow-hidden my-4 relative">
//         <img
//           src={profileImageUrl ? `http://localhost:5000/${profileImageUrl}` : dummyImage}
//           alt="Profile"
//           className="w-full h-full object-cover"
//           crossOrigin="anonymous"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = dummyImage;
//           }}
//           style={{
//             objectFit: 'cover',
//             width: '100%',
//             height: '100%'
//           }}
//         />
//       </div>
//     );
//   };

//   const renderExperience = (experiences, title = "Experience") => (
//     <div className="mb-8" style={{ fontFamily: 'Palatino Linotype' }}>
//       <h2 className="text-xl font-bold border-b border-black mb-4">{title}</h2>
//       {experiences.map((exp, index) => (
//         <div key={index} className="mb-6">
//           <div className="flex items-start">
//             <div className="w-1/4 pr-4">
//               <p className="text-sm">{exp.dates}</p>
//             </div>
//             <div className="w-3/4">
//               <h3 className="font-bold">{exp.jobTitle}</h3>
//               <p className="italic mb-2">{exp.company} | {exp.location}</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 {exp.responsibilities.map((item, i) => (
//                   <li key={i}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderEducation = () => (
//     <div className="mb-8" style={{ fontFamily: 'Palatino Linotype' }}>
//       <h2 className="text-xl font-bold border-b border-black mb-4">Education</h2>
//       {data.education.map((edu, index) => (
//         <div key={index} className="mb-4">
//           <div className="flex items-start">
//             <div className="w-1/4 pr-4">
//               <p className="text-sm">{edu.dates}</p>
//             </div>
//             <div className="w-3/4">
//               <h3 className="font-bold">{edu.institution}</h3>
//               <p className="italic">{edu.degree}</p>
//               {edu.location && <p className="text-sm">{edu.location}</p>}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderSkills = () => (
//     <div className="mb-8" style={{ fontFamily: 'Palatino Linotype' }}>
//       <h2 className="text-xl font-bold border-b border-black mb-4">Key Skills</h2>
//       <ul className="list-disc pl-5 space-y-1">
//         {data.keySkills.map((skill, index) => (
//           <li key={index}>{skill}</li>
//         ))}
//       </ul>
//     </div>
//   );

//   const renderInterests = () => (
//     data.interests?.length > 0 && (
//       <div className="mb-8" style={{ fontFamily: 'Palatino Linotype' }}>
//         <h2 className="text-xl font-bold border-b border-black mb-4">Interests</h2>
//         <ul className="list-disc pl-5 space-y-1">
//           {data.interests.map((interest, index) => (
//             <li key={index}>{interest}</li>
//           ))}
//         </ul>
//       </div>
//     )
//   );

//   const renderHeader = () => {
//     return (
//       <div className="relative pb-4" style={{ fontFamily: 'Palatino Linotype' }}>
//         <div className="text-center mb-2">
//           <h1 className="text-3xl font-bold uppercase">{data.header.name}</h1>
//           <h2 className="text-xl font-medium">{data.header.jobTitle}</h2>
//         </div>
//         {renderProfileImage()}
//         {renderPersonalDetails()}
//       </div>
//     );
//   };

//   const renderFooter = () => (
//     <div className="page-footer text-center text-xs mt-8 pt-4 border-t border-gray-300" 
//          style={{ fontFamily: 'Palatino Linotype' }}>
//       Exclusive Household Staff & Nannies<br />
//       www.exclusivehouseholdstaff.com<br />
//       Telephone: +44 (0) 203 358 7000
//     </div>
//   );

//   const renderPages = () => {
//     return (
//       <div className="space-y-8 bg-gray-100 p-8">
//         {/* Page 1 */}
//         <div 
//           className="pdf-page relative bg-white p-8 shadow-lg" 
//           style={{ 
//             minHeight: '1123px', // A4 height in pixels (297mm at 96dpi)
//             pageBreakAfter: 'always'
//           }}
//         >
//           {/* Visual page indicator (only for screen) */}
//           <div className="page-indicator absolute bottom-0 left-0 right-0 h-2 bg-gray-300 flex items-center justify-center">
//             <span className="bg-white px-4 text-gray-600 text-sm">PAGE 1</span>
//           </div>
          
//           {renderLogos()}
//           {renderHeader()}
//           <div className="mb-8">
//             <h2 className="text-xl font-bold border-b border-black mb-2">Profile</h2>
//             <p className="text-justify">{data.profile}</p>
//           </div>
//           {renderExperience(data.experience.slice(0, 2))}
//           {renderFooter()}
//         </div>

//         {/* Page 2 */}
//         <div 
//           className="pdf-page relative bg-white p-8 shadow-lg" 
//           style={{ 
//             minHeight: '1123px', // A4 height in pixels
//             pageBreakAfter: 'always'
//           }}
//         >
//           {/* Visual page indicator (only for screen) */}
//           <div className="page-indicator absolute bottom-0 left-0 right-0 h-2 bg-gray-300 flex items-center justify-center">
//             <span className="bg-white px-4 text-gray-600 text-sm">PAGE 2</span>
//           </div>
          
//           {renderLogos()}
//           {data.experience.length > 2 && renderExperience(data.experience.slice(2), "Experience (cont.)")}
//           {renderEducation()}
//           {renderSkills()}
//           {renderInterests()}
//           {renderFooter()}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div ref={resumeRef} className="max-w-4xl mx-auto">
//         {renderPages()}

//         <div className="bg-gray-50 px-8 py-4 border-t flex justify-end space-x-4 mt-8">
//           <button
//             onClick={() => router.push('/dashboard')}
//             className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200"
//             disabled={isGeneratingPDF}
//           >
//             Back
//           </button>
//           <button
//             onClick={downloadPDF}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
//             disabled={isGeneratingPDF}
//           >
//             {isGeneratingPDF ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating PDF...
//               </>
//             ) : 'Download PDF'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




