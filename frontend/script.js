
"use strict";

// ============================================
// BUGLENS AI - CONFIGURATION
// ============================================

const API_URL = "http://127.0.0.1:8000/analyze";

// ============================================
// DOM ELEMENTS
// ============================================

const bugForm = document.getElementById("bugForm");
const descriptionInput = document.getElementById("bugDescription");
const charCount = document.getElementById("charCount");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

let latestReport = null;
let requestInProgress = false;

// ============================================
// CHARACTER COUNTER
// ============================================

function updateCharacterCount() {
    const length = descriptionInput.value.length;

    charCount.textContent = `${length} / 5000`;

    charCount.style.color =
        length >= 4800 ? "#ff6b83" : "";
}

descriptionInput.addEventListener("input", updateCharacterCount);

// ============================================
// ERROR MESSAGES
// ============================================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function hideError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

// ============================================
// LOADING STATE
// ============================================

function setLoading(isLoading) {
    requestInProgress = isLoading;

    loading.style.display = isLoading ? "flex" : "none";
    analyzeBtn.disabled = isLoading;
    clearBtn.disabled = isLoading;

    analyzeBtn.innerHTML = isLoading
        ? '<span class="button-symbol">◌</span> ANALYZING...'
        : '<span class="button-symbol">↗</span> ANALYZE ISSUE';
}

// ============================================
// WORKFLOW PROGRESS
// ============================================

function setWorkflowStep(currentStep) {
    const steps = document.querySelectorAll(".workflow-step");

    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        const number = step.querySelector(".step-number");

        step.classList.toggle(
            "active",
            stepNumber === currentStep
        );

        step.classList.toggle(
            "completed",
            stepNumber < currentStep
        );

        if (number) {
            number.textContent =
                stepNumber < currentStep
                    ? "✓"
                    : String(stepNumber).padStart(2, "0");
        }
    });
}

// ============================================
// SAFE TEXT OUTPUT
// ============================================

function setText(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) return;

    const text = value === null || value === undefined
        ? ""
        : String(value).trim();

    element.textContent = text || "Not available";
}

// ============================================
// SEVERITY CLASSIFICATION
// ============================================

function renderSeverity(value) {
    const element = document.getElementById("severity");

    const allowed = ["critical", "high", "medium", "low"];

    const normalized = String(value || "Medium").toLowerCase();

    const severity = allowed.includes(normalized)
        ? normalized
        : "medium";

    element.className = `severity ${severity}`;
    element.textContent = severity.toUpperCase();
}

// ============================================
// ROOT CAUSES
// ============================================

function renderCauses(causes) {
    const list = document.getElementById("possibleCauses");

    list.replaceChildren();

    if (!Array.isArray(causes) || causes.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No potential root causes were returned.";
        list.appendChild(item);
        return;
    }

    causes.forEach((cause) => {
        const item = document.createElement("li");
        item.textContent = String(cause);
        list.appendChild(item);
    });
}

// ============================================
// DISPLAY ANALYSIS REPORT
// ============================================

function renderResults(data) {
    latestReport = data;

    setText("bugTitle", data.bug_title);
    setText("affectedFeature", data.affected_feature);
    setText("issueSummary", data.issue_summary);
    setText("severityReason", data.severity_reason);
    setText("formattedReport", data.formatted_report);

    renderSeverity(data.severity);
    renderCauses(data.possible_causes);

    results.style.display = "block";

    // Start the resolution checklist unchecked for a new report.
    document.querySelectorAll(".resolution-item input").forEach((checkbox) => {
        checkbox.checked = false;
    });

    setWorkflowStep(3);

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ============================================
// ANALYZE ISSUE
// ============================================

bugForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (requestInProgress) return;

    hideError();

    const description = descriptionInput.value.trim();

    if (description.length < 10) {
        showError(
            "Please describe the issue in at least 10 characters."
        );

        descriptionInput.focus();
        return;
    }

    if (description.length > 5000) {
        showError(
            "The issue description must not exceed 5000 characters."
        );

        return;
    }

    setLoading(true);
    results.style.display = "none";
    setWorkflowStep(2);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                description: description
            })
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "The server returned an invalid response. Please try again."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.detail ||
                `Analysis failed with HTTP status ${response.status}.`
            );
        }

        if (!data || typeof data !== "object") {
            throw new Error("Unexpected response received from the API.");
        }

        renderResults(data);

    } catch (error) {
        console.error("BugLens AI analysis error:", error);

        if (error instanceof TypeError) {
            showError(
                "Unable to connect to the backend. Start FastAPI at " +
                "http://127.0.0.1:8000 and check your network connection."
            );
        } else {
            showError(
                error.message ||
                "An unexpected error occurred. Please try again."
            );
        }

        setWorkflowStep(2);

    } finally {
        setLoading(false);
    }
});

// ============================================
// CLEAR / RESET WORKSPACE
// ============================================

clearBtn.addEventListener("click", () => {
    if (requestInProgress) return;

    // Clear the description.
    bugForm.reset();

    // Reset character counter.
    updateCharacterCount();

    // Hide errors and previous results.
    hideError();
    results.style.display = "none";
    loading.style.display = "none";

    // Forget the current downloadable report.
    latestReport = null;

    // Reset resolution checklist.
    document.querySelectorAll(".resolution-item input").forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Restore the initial workflow.
    setWorkflowStep(1);

    // Restore the initial scroll position.
    document.getElementById("analyzer").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    descriptionInput.focus();
});

// ============================================
// DOWNLOAD REPORT AS JSON
// ============================================

downloadBtn.addEventListener("click", () => {
    if (!latestReport) {
        showError("Analyze an issue before exporting a report.");
        return;
    }

    let downloadUrl;

    try {
        const json = JSON.stringify(latestReport, null, 2);

        const blob = new Blob(
            [json],
            { type: "application/json;charset=utf-8" }
        );

        downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "buglens-diagnostic-report.json";

        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error("Report export error:", error);
        showError("Could not export the report. Please try again.");

    } finally {
        if (downloadUrl) {
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        }
    }
});

// ============================================
// INITIALIZE APPLICATION
// ============================================

updateCharacterCount();
hideError();
setLoading(false);
setWorkflowStep(1);

console.log("BugLens AI initialized successfully.");
