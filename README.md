Resume Analyzer
Overview
The Resume Analyzer is a full-stack web application built to simplify the process of evaluating resumes for job applications. Leveraging Flask for the backend, React and Next.js for the frontend, and advanced NLP (Natural Language Processing) techniques, this tool extracts key information from resumes and analyzes how well they match the job description. The app provides a match score, identifies missing skills, and offers recommendations to improve resume relevance.

Features
PDF Resume Upload: Users can upload resumes in PDF format.

Job Description Input: Users can paste job descriptions to compare and analyze resumes against.

Automatic Skills Extraction: The system automatically extracts key skills from resumes and compares them with the job requirements.

Match Score: A match score indicating how well the resume fits the job description.

Skills Feedback: List of skills present and missing in the uploaded resume.

Machine Learning Integration: Leveraging scikit-learn for advanced analysis and matching.

Natural Language Processing: Uses spaCy for extracting skills and information from resumes.

User Authentication: Secure login system with JSON Web Tokens (JWT).

User-Friendly Interface: Clean and intuitive interface built with React and Next.js for a smooth user experience.

Tech Stack
Backend:
Flask: Lightweight Python web framework.

Flask-CORS: To handle Cross-Origin Resource Sharing (CORS).

pdfplumber: PDF text extraction library for parsing resumes.

scikit-learn: Used for machine learning models and analysis.

spaCy: NLP library for text analysis and skill extraction.

ReportLab: To generate PDF reports.

python-dotenv: To manage environment variables.

python-multipart: For handling multipart form data (e.g., file uploads).

Frontend:
React: JavaScript library for building the user interface.

Next.js: React framework for server-side rendering and static site generation.

Tailwind CSS: Utility-first CSS framework for styling.

Axios: For making HTTP requests to the backend.

Database:
MongoDB (if needed for storing user data, resumes, or job descriptions).

Installation & Setup
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
2. Backend Setup
Navigate to the backend folder.

bash
Copy
Edit
cd backend
Create a virtual environment and activate it.

bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
Install the backend dependencies.

bash
Copy
Edit
pip install -r requirements.txt
Create a .env file and configure your environment variables (e.g., database URI, JWT secret).

Run the Flask server.

bash
Copy
Edit
flask run
3. Frontend Setup
Navigate to the frontend folder.

bash
Copy
Edit
cd frontend
Install the frontend dependencies.

bash
Copy
Edit
npm install
Run the Next.js development server.

bash
Copy
Edit
npm run dev
4. Visit the App
Open your browser and navigate to http://localhost:3000 to interact with the Resume Analyzer.

How It Works
Upload Resume: Upload your resume in PDF format.

Job Description: Paste the job description you're applying for.

Analyze: Click the "Analyze" button to extract text and compare the resume with the job description.

View Results:

Match Score: See how well your resume fits the job.

Skills Found: List of skills your resume already includes.

Skills Missing: List of skills you need to add to improve your resume.

Feedback: Get detailed feedback to enhance your resume and improve your chances.

Contributing
We welcome contributions to improve the Resume Analyzer! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch.

Make your changes.

Create a pull request with a detailed description of your changes.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
Author: Sameer

Email: sameermalik63901@gmail.com
Live Link:
