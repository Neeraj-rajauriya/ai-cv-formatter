'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formattedResume, setFormattedResume] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!resume) {
    setError('Please select a resume file');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    console.log("Is token",token);
    if (!token) {
      router.push('/');
      return;
    }

    const formData = new FormData();
    formData.append('cv', resume);

    const response = await fetch('http://localhost:5000/api/cv/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Make sure this matches your backend expectation
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
    setError(err.message || 'Failed to upload resume');
    console.error('Upload error:', err);
    
    // If token is invalid, redirect to login
    if (err.message.includes('token')) {
      localStorage.removeItem('token');
    //   router.push('/');
    }
  } finally {
    setIsLoading(false);
  }
};

  if (formattedResume) {
    return <ResumeDisplay data={formattedResume} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-rose-500">AI Resume Formatter</span>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Resume</h1>
            <p className="text-gray-600">Get your resume professionally formatted in seconds</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-rose-300 rounded-xl p-8 text-center bg-rose-50">
                <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                  <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span className="text-gray-600">
                    {resume ? resume.name : 'Click to select resume file'}
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                    required
                  />
                </label>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </div>

              <button
                type="submit"
                disabled={isLoading || !resume}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-70"
              >
                {isLoading ? 'Processing...' : 'Format My Resume'}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ResumeDisplay({ data }) {
  const router = useRouter();

  const downloadPDF = () => {
    // Implement PDF download functionality here
    alert('PDF download would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold uppercase">{data.header.name}</h1>
            <h2 className="text-xl font-medium mt-2">{data.header.jobTitle}</h2>
          </div>

          {/* Personal Details */}
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
                <p>{data.personalDetails.languages}</p>
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
          </div>

          {/* Profile */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-black mb-2">Profile</h2>
            <p className="text-justify">{data.profile}</p>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-black mb-4">Experience</h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between">
                  <h3 className="font-bold">{exp.company}</h3>
                  <p>{exp.date}</p>
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

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-black mb-4">Education</h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold">{edu.institution}</h3>
                <p className="italic">{edu.degree}</p>
                {edu.cgpa && <p>CGPA: {edu.cgpa}</p>}
              </div>
            ))}
          </div>

          {/* Key Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-black mb-4">Key Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.keySkills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b-2 border-black mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t flex justify-end space-x-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md"
          >
            Back
          </button>
          <button 
            onClick={downloadPDF}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-md"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}