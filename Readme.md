# 📄 CV Formatter

An **AI-powered CV formatting application** that extracts text from resumes (PDF/DOCX), applies intelligent formatting rules, and generates a clean, structured CV layout.

## 🚀 Features
- **File Upload Support**: PDF, DOCX (adapter pattern ready for more file types)
- **Text Extraction**: Reads unstructured text from uploaded CVs
- **AI-Powered Formatting**:
  - Applies typography, structure, and tone adjustments
  - Removes redundant phrases and fixes common mistakes
  - Organizes content into structured sections
- **JSON Output**: Clean AI-generated JSON for frontend rendering
- **Full-Stack Setup**: Backend (Node.js + Express + MongoDB) & Frontend (React)

## 📂 Project Structure
cv-formatter/
│
├── backend/          # Node.js + Express server
│   ├── src/
│   │   ├── controllers/   # Upload & processing logic
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   ├── utils/             # OpenAI formatting function
│   ├── .env               # API keys & environment variables
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Pages for rendering formatted CV
│
└── README.md

## ⚙️ Tech Stack
**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- OpenAI API
- Multer (file uploads)
- pdf-text-extract (PDF parsing)

**Frontend**
- React.js
- Axios (API calls)
- TailwindCSS (styling)

## 🔑 Environment Variables
Create a `.env` file inside `backend/`:
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key

## 🖥️ Running the Project
### 1️⃣ Backend
cd backend
npm install
npm run dev

### 2️⃣ Frontend
cd frontend
npm install
npm start

## 📌 API Flow
1. **Upload CV** via `/upload` endpoint
2. **Extract Text** from the uploaded file
3. **Send Text** to OpenAI with formatting rules
4. **Receive JSON** with structured CV data
5. **Render CV** on frontend as an HTML page

## 📄 Example JSON Output from OpenAI
{
  "header": { "name": "John Doe", "jobTitle": "Software Engineer", "photoUrl": "/uploads/john.jpg" },
  "personalDetails": {
    "nationality": "American",
    "languages": ["English", "Spanish"],
    "dob": "Jan 1990",
    "maritalStatus": "Single"
  },
  "profile": "Passionate software engineer with 5+ years of experience...",
  "experience": [
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "date": "Jan 2020 - Present",
      "points": ["Developed REST APIs", "Led a team of 5 engineers"]
    }
  ],
  "education": [
    { "degree": "B.Sc Computer Science", "institution": "MIT", "year": "2014" }
  ],
  "keySkills": ["JavaScript", "Node.js", "React", "MongoDB"],
  "interests": ["Coding", "Reading", "Traveling"]
}

## 🏗 Future Improvements
- Add DOCX and image file extraction
- Add authentication & user profiles
- Export CV as PDF directly
- More AI-powered formatting templates


