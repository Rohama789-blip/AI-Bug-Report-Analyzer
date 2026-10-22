# 🐞 BugLens AI — AI Bug Report Analyzer

An AI-powered bug analysis system that transforms raw issue descriptions into structured diagnostic reports. Built with **Python, FastAPI, LangGraph, Groq AI, HTML, CSS, and JavaScript**.

## ✨ Features

- 🤖 AI-powered bug analysis
- 🏷️ Automatic bug title generation
- 🎯 Affected feature identification
- 🚦 Bug severity classification
- 🔍 Possible root cause identification
- 📝 Structured diagnostic reports
- 📥 Export reports as JSON
- 🧹 Clear and reset the analyzer
- 🎨 Modern, responsive dark-themed user interface

## 🛠️ Tech Stack

**Backend**
- Python
- FastAPI
- LangGraph
- Groq API

**Frontend**
- HTML5
- CSS3
- JavaScript

## 📁 Project Structure

```text
AI-Bug-Report-Analyzer/
├── backend/
│   ├── main.py
│   ├── graph.py
│   ├── nodes.py
│   └── state.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Bug-Report-Analyzer
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Use the exact environment variable name expected by your backend code. Never upload your actual API key to GitHub.

### 5. Start the backend

Open a terminal in the `backend` directory and run:

```bash
python -m uvicorn main:app --reload
```

Backend API:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 6. Run the frontend

Open `frontend/index.html` using the VS Code Live Server extension.

Keep the backend running while using the frontend.

## 🧪 Example Bug Report

```text
When a user enters a valid email and password
on the login page and clicks the Login button,
nothing happens. The user cannot access the
dashboard, and no error message is displayed.
```

BugLens AI analyzes the description and returns a structured report containing the bug title, affected feature, issue summary, severity, severity reason, possible causes, and formatted report.

## 🔐 Security

- Store API keys in environment variables.
- Keep `.env` out of version control.
- Use `.env.example` to document the required environment variables without including secrets.

## 🚀 Future Improvements

- AI-generated bug fix suggestions
- Automated code-level debugging
- Bug report history
- User authentication
- Database integration
- Cloud deployment

## 📄 License

This project is available for educational and portfolio purposes. Add a license file if you intend to distribute it under a specific open-source license.
