from pydantic import BaseModel
from typing import List

class AnalysisResponse(BaseModel):
    match_score: float
    skills_found: List[str]
    missing_skills: List[str]
    report_path: str