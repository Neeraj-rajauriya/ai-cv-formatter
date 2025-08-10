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

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${element.offsetWidth}px`;
    tempContainer.innerHTML = element.innerHTML;
    document.body.appendChild(tempContainer);

    // Optimized PDF generation settings
    const options = {
      scale: 1, // Reduced from 2 to 1 for smaller file size
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      quality: 0.8, // Reduced quality for smaller file size
      onclone: (clonedDoc) => {
        // Fix image URLs
        const images = clonedDoc.querySelectorAll('img');
        images.forEach((img) => {
          if (img.src.includes('uploads')) {
            img.src = `http://localhost:5000/${img.src.replace(/.*uploads/, 'uploads')}`;
          }
          img.crossOrigin = 'Anonymous';
          img.style.maxWidth = '100%';
        });
        
        // Remove buttons and interactive elements
        const buttons = clonedDoc.querySelectorAll('button');
        buttons.forEach(button => button.remove());
      },
    };

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      hotfixes: ['px_scaling'],
      compress: true // Enable PDF compression
    });

    const canvas = await html2canvas(tempContainer, options);
    
    // Calculate dimensions with margins
    const imgWidth = pdf.internal.pageSize.getWidth() - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add first page
    pdf.addImage(canvas, 'JPEG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');
    
    // Add additional pages if needed
    let heightLeft = imgHeight;
    const pageHeight = pdf.internal.pageSize.getHeight() - 20;
    
    while (heightLeft >= 0) {
      pdf.addPage();
      heightLeft -= pageHeight;
      pdf.addImage(canvas, 'JPEG', 10, -(heightLeft + 10), imgWidth, imgHeight, undefined, 'FAST');
    }

    // Save with optimized settings
    pdf.save(`${data.header.name.replace(/\s+/g, '_')}_CV.pdf`, {
      compression: true
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    // Clean up
    const tempContainer = document.querySelector('#temp-pdf-container');
    if (tempContainer) {
      document.body.removeChild(tempContainer);
    }
    setIsGeneratingPDF(false);
  }
};

  const preloadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve; // Resolve even if image fails to load
      // Add timeout in case image hangs
      setTimeout(resolve, 2000);
    });
  };

  const renderPersonalDetails = () => (
    <div className="grid grid-cols-2 gap-4 mb-8 pb-6 border-b">
      {data.personalDetails.nationality && (
        <div>
          <h3 className="font-semibold">Nationality:</h3>
          <p>{data.personalDetails.nationality}</p>
        </div>
      )}
      {data.personalDetails.languages && (
        <div>
          <h3 className="font-semibold">Languages:</h3>
          <p>{Array.isArray(data.personalDetails.languages) 
            ? data.personalDetails.languages.join(', ')
            : data.personalDetails.languages}</p>
        </div>
      )}
      {data.personalDetails.dob && (
        <div>
          <h3 className="font-semibold">Date of Birth:</h3>
          <p>{data.personalDetails.dob}</p>
        </div>
      )}
      {data.personalDetails.maritalStatus && (
        <div>
          <h3 className="font-semibold">Marital Status:</h3>
          <p>{data.personalDetails.maritalStatus}</p>
        </div>
      )}
      {data.personalDetails.drivingLicense && (
        <div>
          <h3 className="font-semibold">Driving License:</h3>
          <p>{data.personalDetails.drivingLicense}</p>
        </div>
      )}
      {data.personalDetails.smoker && (
        <div>
          <h3 className="font-semibold">Smoker:</h3>
          <p>{data.personalDetails.smoker}</p>
        </div>
      )}
      {data.personalDetails.pets && (
        <div>
          <h3 className="font-semibold">Pets:</h3>
          <p>{data.personalDetails.pets}</p>
        </div>
      )}
      {data.personalDetails.dbsStatus && (
        <div>
          <h3 className="font-semibold">DBS Status:</h3>
          <p>{data.personalDetails.dbsStatus}</p>
        </div>
      )}
    </div>
  );

  const renderExperience = (experiences, title = "Professional Experience") => (
    <div className="mb-8">
      <h2 className="text-xl font-bold border-b-2 border-black mb-4">{title}</h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between">
            <h3 className="font-bold">{exp.company}</h3>
            <p>{exp.dates || exp.date}</p>
          </div>
          <p className="italic mb-2">{exp.jobTitle} | {exp.location}</p>
          <ul className="list-disc pl-5 space-y-1">
            {exp.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold border-b-2 border-black mb-4">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold">{edu.institution}</h3>
            {edu.dates && <p>{edu.dates}</p>}
          </div>
          <p className="italic">{edu.degree}</p>
          {edu.location && <p className="text-sm">{edu.location}</p>}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold border-b-2 border-black mb-4">Key Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.keySkills.map((skill, index) => (
          <div key={index} className="flex">
            <span className="mr-2">•</span>
            <span>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterests = () => (
    data.interests?.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-bold border-b-2 border-black mb-4">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {data.interests.map((interest, index) => (
            <span key={index} className="bg-gray-100 px-3 py-1 rounded">
              {interest}
            </span>
          ))}
        </div>
      </div>
    )
  );

  const renderFooter = () => (
  data.footer && (
    <div className="mt-8 pt-4 border-t-4 border-red-600 bg-red-600 text-white text-center text-sm whitespace-pre-line">
      Exclusive Household Staff & Nannies
      <br />
      www.exclusivehouseholdstaff.com
      <br />
      Telephone: +44 (0) 203 358 7000
    </div>
  )
);

  const renderSimpleHeader = () => (
  <div className="flex justify-between mb-4">
    <div className="w-32 h-16 relative">
      <img
        src="/title.png"
        alt="Company Logo"
        className="h-full w-auto object-contain object-left"
        crossOrigin="anonymous"
      />
    </div>
    <div className="w-32 h-16 relative">
      <img
        src="/title_2.png"
        alt="Company Logo"
        className="h-full w-auto object-contain object-right"
        crossOrigin="anonymous"
      />
    </div>
  </div>
);

const renderHeader = () => {
  const profileImageUrl = data.header.photoUrl?.replace(/\\/g, '/');
  
  return (
    <div className="relative pb-8 border-b border-gray-200">
      {/* Logos - same as simple header */}
      <div className="flex justify-between mb-4">
        <div className="w-32 h-16 relative">
          <img
            src="/title.png"
            alt="Company Logo"
            className="h-full w-auto object-contain object-left"
            crossOrigin="anonymous"
          />
        </div>
        <div className="w-32 h-16 relative">
          <img
            src="/title_2.png"
            alt="Company Logo"
            className="h-full w-auto object-contain object-right"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Personal info section - only on first page */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold uppercase">{data.header.name}</h1>
          <h2 className="text-xl font-medium mt-2">{data.header.jobTitle}</h2>
          <div className="mt-4 space-y-1">
            {data.header.contact?.phone && (
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                {data.header.contact.phone}
              </p>
            )}
            {data.header.contact?.email && (
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {data.header.contact.email}
              </p>
            )}
          </div>
        </div>
        
        {profileImageUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={`http://localhost:5000/${profileImageUrl}`}
              alt="Profile"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnpNMTIgNWMxLjgyNyAwIDMuMzMxIDEuNDk2IDMuMzMxIDMuMzMxUzEzLjgyNyAxMS42NjIgMTIgMTEuNjYyIDguNjY5IDEwLjE2NiA4LjY2OSA4LjMzMSAxMC4xNzMgNSAxMiA1ek0xMiAxOWMtMy4xNTIgMC01LjgxMS0xLjYxNy03LjQxLTQuMjY3QzUuMDMxIDE0LjY1NiA4LjE4OCAxMyA5LjUgMTNjMS4wNzggMCAzIDIgNC41IDJzMy40MjItMiA0LjUtMmMxLjMxMiAwIDQuNDY5IDEuNjU2IDQuOTEgMS43MzNDMTcuODExIDE3LjM4MyAxNS4xNTIgMTkgMTIgMTl6Ii8+PC9zdmc+';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
const renderPages = () => {
  return (
    <div className="space-y-8">
      {/* Page 1 */}
      <div className="page-break-after page-container">
        {renderHeader()}
        {renderPersonalDetails()}
        <div className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-black mb-2">Profile</h2>
          <p className="text-justify">{data.profile}</p>
        </div>
        {renderExperience(data.experience.slice(0, 2))}
        <div className="page-footer">
          Exclusive Household Staff & Nannies<br />
          www.exclusivehouseholdstaff.com<br />
          Telephone: +44 (0) 203 358 7000
        </div>
      </div>

      {/* Page 2+ */}
      {data.experience.length > 2 && (
        <div className="page-break-after page-container">
          {renderSimpleHeader()}
          {renderExperience(data.experience.slice(2), "Professional Experience (cont.)")}
          {renderEducation()}
          {renderSkills()}
          {renderInterests()}
          <div className="page-footer">
            Exclusive Household Staff & Nannies<br />
            www.exclusivehouseholdstaff.com<br />
            Telephone: +44 (0) 203 358 7000
          </div>
        </div>
      )}

      {/* Single page case */}
      {data.experience.length <= 2 && (
        <div className="page-container">
          {renderEducation()}
          {renderSkills()}
          {renderInterests()}
          <div className="page-footer">
            Exclusive Household Staff & Nannies<br />
            www.exclusivehouseholdstaff.com<br />
            Telephone: +44 (0) 203 358 7000
          </div>
        </div>
      )}
    </div>
  );
};

return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div ref={resumeRef} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-8">
        {renderPages()}
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t flex justify-end space-x-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200"
          disabled={isGeneratingPDF}
          aria-label="Go back to dashboard"
        >
          Back
        </button>
        <button
          onClick={downloadPDF}
          className="download-btn bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
          disabled={isGeneratingPDF}
          aria-label={isGeneratingPDF ? 'Generating PDF' : 'Download PDF'}
        >
          {isGeneratingPDF ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : 'Download PDF'}
        </button>
      </div>
    </div>
  </div>
);
}
