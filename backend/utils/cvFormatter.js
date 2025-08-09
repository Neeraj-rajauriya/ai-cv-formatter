
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function formatCV(extractedText) {
  const prompt = `
You are an AI-powered CV formatter. 
You will receive unstructured CV data extracted from a document.
Transform the data according to the following rules:

Typography & Structure
- Font: Palatino Linotype throughout (note this in output metadata)
- Photo Sizing: 4.7cm, convert landscape to portrait
- Date Format: Use first 3 letters of month only (e.g., Jan 2020)
- Job titles: Always start with a capital letter

Content Organization
1. Header: Name, Job Title, Professional Photo
2. Personal Details: Nationality, Languages, DOB, Marital Status
3. Profile: Professional summary
4. Experience: Reverse chronological, bullet points
5. Education: Consistent formatting
6. Key Skills: Bullet points
7. Interests: Bullet points

Content Cleanup Rules
- Replace "I am responsible for" → "Responsible for"
- Replace "Principle" → "Principal", "Discrete" → "Discreet"
- Remove fields: Age, Dependants
- Convert paragraphs to bullet points
- Ensure professional tone

OUTPUT FORMAT:
Return a JSON object with the following keys:
{
  "header": { "name": "", "jobTitle": "", "photoUrl": "" },
  "personalDetails": {},
  "profile": "",
  "experience": [],
  "education": [],
  "keySkills": [],
  "interests": []
}

EXTRACTED CV DATA:
${extractedText}
IMPORTANT: Return ONLY valid JSON without any Markdown formatting or code blocks. Do not include \`\`\`json or \`\`\` in your response.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast & cheap, change if needed
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    // Parse JSON from AI response
    const jsonOutput = JSON.parse(response.choices[0].message.content);
    return jsonOutput;
  } catch (error) {
    console.error("Error formatting CV:", error);
    throw error;
  }
}


// import OpenAI from 'openai';
// import dotenv from "dotenv";
// dotenv.config();

// const openai = new OpenAI(process.env.OPENAI_API_KEY);

// export const formatCV = async (text) => {
//   const prompt = `
//   Analyze this resume text and extract the following information in JSON format exactly as specified:
  
//   {
//     "header": {
//       "name": "Full Name",
//       "jobTitle": "Current Job Title",
//       "photoUrl": ""
//     },
//     "personalDetails": {
//       "nationality": "",
//       "languages": "",
//       "dob": "",
//       "maritalStatus": ""
//     },
//     "profile": "3-4 sentence professional summary",
//     "experience": [{
//       "jobTitle": "",
//       "company": "",
//       "location": "",
//       "date": "",
//       "responsibilities": []
//     }],
//     "education": [{
//       "degree": "",
//       "institution": "",
//       "cgpa": ""
//     }],
//     "keySkills": [],
//     "interests": []
//   }

//   Follow these guidelines:
//   1. Structure exactly like the Oliver template example
//   2. Format dates as "MMM YYYY – MMM YYYY" or "MMM YYYY – Present"
//   3. Keep responsibilities concise but impactful
//   4. Extract all technical skills into keySkills
//   5. Put extracurriculars in interests
  
//   Resume text: ${text}
//   `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: "You are a professional resume parser that outputs clean JSON." },
//       { role: "user", content: prompt }
//     ],
//     temperature: 0.3
//   });

//   return JSON.parse(response.choices[0].message.content);
// };