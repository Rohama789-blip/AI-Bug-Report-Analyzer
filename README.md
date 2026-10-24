# 🐞 BugLens AI — AI Bug Report Analyzer

BugLens AI is an AI-powered bug analysis application that transforms raw issue descriptions into structured diagnostic reports using **LangGraph, Groq, and LangSmith**.

## ✨ Features

- 🤖 AI-powered bug analysis
- 📝 Automatic bug title and issue summary
- 🎯 Affected feature identification
- 🚦 Bug severity classification
- 🔍 Possible root cause analysis
- 📋 Structured diagnostic reports
- 📥 Export diagnostic reports as JSON
- 🧹 Clear and reset functionality
- 📊 LangSmith tracing for monitoring AI workflow runs
- 🎨 Modern, responsive dark-themed user interface

## 🛠️ Tech Stack

**Backend**
- Python
- FastAPI
- LangGraph
- LangChain Groq
- Groq API
- LangSmith

**Frontend**
- HTML5
- CSS3
- JavaScript

## 📂 Project Structure

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
git clone https://github.com/Rohama789-blip/AI-Bug-Report-Analyzer.git
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

Create a `.env` file in the project root. Add your own API keys:

```env
GROQ_API_KEY=your_groq_api_key
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_PROJECT=BugLens-AI
```

Never commit your actual `.env` file or expose your API keys.

### 5. Start the backend

From the project root, activate the virtual environment first. Then run:

```bash
cd backend
python -m uvicorn main:app --reload
```

Backend API: http://127.0.0.1:8000

Interactive API documentation: http://127.0.0.1:8000/docs

### 6. Start the frontend

Open a second terminal in the project root, activate the virtual environment if needed, and run:

```bash
cd frontend
python -m http.server 5500
```

Open http://127.0.0.1:5500 in your browser.

Keep both servers running while using the application.

## 📊 LangSmith Tracing

LangSmith can trace supported LangGraph workflow runs when tracing is enabled and the environment variables are configured correctly.

1. Create an account at [LangSmith](https://smith.langchain.com/).
2. Generate a LangSmith API key.
3. Add the LangSmith environment variables to your root `.env` file.
4. Run BugLens AI and analyze a bug report.
5. Open your LangSmith dashboard and select the `BugLens-AI` project to inspect available traces.

Tracing requires a valid API key, correct environment configuration, and a workflow run that supports tracing.

## 🧪 Example Input

```text
When a user clicks the login button after entering valid
credentials, nothing happens and the dashboard does not open.
```

BugLens AI returns a structured diagnostic report containing the bug title, affected feature, issue summary, severity, severity reason, possible causes, and formatted report.

## 🔮 Future Improvements

- AI-generated bug fix suggestions
- Bug report history
- Database integration
- Automated debugging
- Cloud deployment

## 📄 License

For educational and portfolio purposes. Add a license file if you plan to distribute the project under a specific open-source license.
