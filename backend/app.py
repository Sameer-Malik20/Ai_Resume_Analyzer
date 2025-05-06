from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import spacy
import pdfplumber
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import re

app = Flask(__name__)
CORS(app)

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

def extract_text_from_pdf(pdf_file) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    """
    try:
        with pdfplumber.open(pdf_file) as pdf:
            text = " ".join(page.extract_text() for page in pdf.pages if page.extract_text())
        return text
    except Exception as e:
        raise ValueError(f"Failed to process the PDF file: {str(e)}")

def preprocess_text(text: str) -> str:
    """
    Preprocesses text by removing special characters, extra spaces, and converting to lowercase.
    """
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text)  # Remove extra spaces
    return text.lower()

def extract_skills_using_spacy(text: str):
    """
    Extracts potential skills from the given text using keyword matching.
    """
    # Predefined skill set
    skill_keywords = [
    # Programming Languages
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "Ruby", "Kotlin", "Swift",
    
    # Web Development
    "HTML", "CSS", "SASS", "Bootstrap", "Tailwind CSS", "React.js", "Next.js", "Vue.js", "Angular", 
    "jQuery", "Express.js", "Node.js", "Django", "Flask", "ASP.NET", "Spring Boot", "REST API", "GraphQL",
    
    # Mobile Development
    "React Native", "Flutter", "Android", "iOS", "SwiftUI", "Xamarin",

    # Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Oracle", "Firebase", "SQLite", "Redis", "Elasticsearch",

    # DevOps & Cloud
    "Git", "GitHub", "GitLab", "Bitbucket", "Docker", "Kubernetes", "CI/CD", "Jenkins", 
    "AWS", "Azure", "Google Cloud", "Terraform", "Ansible", "Prometheus", "Grafana",

    # Testing
    "JUnit", "Selenium", "Cypress", "Mocha", "Chai", "Jest", "Postman", "PyTest", "TestNG",

    # Data Science & ML
    "Machine Learning", "Deep Learning", "Data Analysis", "Data Visualization", 
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "Keras", "PyTorch", 
    "OpenCV", "Natural Language Processing", "Computer Vision",

    # Tools & Platforms
    "VS Code", "IntelliJ", "Eclipse", "Android Studio", "Figma", "JIRA", "Slack", "Notion",
    
    # Soft Skills / General
    "Project Management", "Leadership", "Agile", "Scrum", "Communication", "Problem Solving", 
    "Time Management", "Teamwork", "Critical Thinking"
]


    # Match skills using keyword matching
    found_skills = []
    for skill in skill_keywords:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return list(set(found_skills))  # Remove duplicates

def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculates the cosine similarity between two texts using TF-IDF.
    """
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(similarity, 2)  # Round to 2 decimal places

def generate_feedback_report(output_path: str, similarity: float, found_skills: list, missing_skills: list):
    """
    Generates a feedback report in PDF format using reportlab.
    """
    try:
        c = canvas.Canvas(output_path, pagesize=letter)
        c.setFont("Helvetica", 12)
        c.drawString(50, 750, "Resume Analysis Feedback Report")
        c.drawString(50, 730, f"Similarity Score: {similarity * 100:.2f}%")

        
        c.drawString(50, 700, "Skills Found:")
        for i, skill in enumerate(found_skills, start=1):
            c.drawString(70, 700 - (i * 20), f"- {skill}")
        
        c.drawString(50, 700 - (len(found_skills) + 2) * 20, "Skills Missing:")
        for i, skill in enumerate(missing_skills, start=1):
            c.drawString(70, 700 - (len(found_skills) + 2 + i) * 20, f"- {skill}")
        
        c.save()
    except Exception as e:
        raise ValueError(f"Failed to generate feedback report: {str(e)}")

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({"error": "Missing resume file or job description"}), 400

    resume_file = request.files['resume']
    job_description = request.form['job_description']

    try:
        # Extract text and calculate similarity
        resume_text = extract_text_from_pdf(resume_file)
        similarity = calculate_similarity(resume_text, job_description)

        # Extract skills
        job_skills = extract_skills_using_spacy(job_description)
        resume_skills = extract_skills_using_spacy(resume_text)
        found_skills = list(set(job_skills) & set(resume_skills))
        missing_skills = list(set(job_skills) - set(resume_skills))

        # Generate feedback report
        report_path = os.path.join("reports", "feedback_report.pdf")
        os.makedirs("reports", exist_ok=True)
        generate_feedback_report(report_path, similarity, found_skills, missing_skills)

        return jsonify({
            "match_score": similarity,
            "skills_found": found_skills,
            "skills_missing": missing_skills,
            "report_path": report_path
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    """
    Endpoint to download the generated report.
    """
    try:
        return send_from_directory(directory="reports", path=filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": f"Failed to download file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
