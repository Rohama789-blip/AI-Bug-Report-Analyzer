
import os

from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from graph import bug_report_graph


# Load the .env file from the project root
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

app = FastAPI(
    title="AI Bug Report Analyzer",
    description="Analyze software bugs using Groq and LangGraph",
    version="1.0.0",
)

# Allow the local HTML frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class BugRequest(BaseModel):
    description: str = Field(
        min_length=10,
        max_length=5000,
        description="Software bug description",
    )


@app.get("/")
def home():
    return {
        "message": "AI Bug Report Analyzer API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze")
def analyze_bug(request: BugRequest):
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is missing from the .env file.",
        )

    try:
        result = bug_report_graph.invoke({
            "bug_description": request.description
        })

        return {
            "bug_title": result.get("bug_title", ""),
            "affected_feature": result.get("affected_feature", ""),
            "issue_summary": result.get("issue_summary", ""),
            "severity": result.get("severity", "Medium"),
            "severity_reason": result.get("severity_reason", ""),
            "possible_causes": result.get("possible_causes", []),
            "formatted_report": result.get("formatted_report", ""),
        }

    except Exception as exc:
        print(f"Bug analysis failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Bug analysis failed. Check the backend terminal and API configuration.",
        )
