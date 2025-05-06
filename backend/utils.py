import pdfplumber
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from typing import List
import os

os.makedirs("reports", exist_ok=True)

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    """
    try:
        with pdfplumber.open(file_path) as pdf:
            text = " ".join(page.extract_text() for page in pdf.pages if page.extract_text())
        return text
    except Exception as e:
        raise ValueError(f"Failed to process the PDF file: {str(e)}")

def extract_skills(text: str) -> List[str]:
    """
    Extracts predefined skills from the given text using keyword matching.
    """
    skills = [
        "Python", "Java", "SQL", "Machine Learning", "Data Analysis",
        "Communication", "Leadership", "Project Management"
    ]
    found_skills = [skill for skill in skills if skill.lower() in text.lower()]
    return found_skills

def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculates the cosine similarity between two texts using TF-IDF.
    """
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return similarity

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