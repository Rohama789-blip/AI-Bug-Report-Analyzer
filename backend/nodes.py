
import json
import re

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from state import BugReportState


def get_llm():
    return ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=0.2,
        max_retries=2,
    )


def ask_json(system_prompt: str, user_prompt: str) -> dict:
    response = get_llm().invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ])

    content = response.content

    if not isinstance(content, str):
        content = str(content)

    # Extract JSON even if the model wraps it in Markdown.
    match = re.search(r"\{.*\}", content, re.DOTALL)

    if not match:
        raise ValueError("AI did not return valid JSON.")

    return json.loads(match.group(0))


# NODE 1: Analyze the bug
def bug_analysis_node(state: BugReportState) -> dict:
    data = ask_json(
        """
        You are a software QA engineer.
        Analyze the supplied bug report.
        Return only a valid JSON object with these keys:
        bug_title, affected_feature, issue_summary.
        Do not invent details that the user did not provide.
        """,
        state["bug_description"],
    )

    return {
        "bug_title": data["bug_title"],
        "affected_feature": data["affected_feature"],
        "issue_summary": data["issue_summary"],
    }


# NODE 2: Detect severity
def severity_detection_node(state: BugReportState) -> dict:
    data = ask_json(
        """
        You are a software QA severity classifier.
        Classify the bug using only these labels:
        Critical, High, Medium, Low.

        Consider impact, affected functionality, and scope.
        Do not assume facts that are not in the description.
        Return only JSON with keys severity and severity_reason.
        """,
        f"""
        Bug title: {state.get('bug_title', '')}
        Affected feature: {state.get('affected_feature', '')}
        Summary: {state.get('issue_summary', '')}
        Original description: {state['bug_description']}
        """,
    )

    severity = str(data["severity"]).strip().title()

    if severity not in {"Critical", "High", "Medium", "Low"}:
        severity = "Medium"

    return {
        "severity": severity,
        "severity_reason": data["severity_reason"],
    }


# NODE 3: Suggest possible root causes
def root_cause_node(state: BugReportState) -> dict:
    data = ask_json(
        """
        You are an experienced software debugging assistant.
        Suggest 2 to 4 plausible root causes.
        These are hypotheses, not confirmed diagnoses.
        Return only valid JSON with a possible_causes array of strings.
        """,
        f"""
        Bug: {state.get('bug_title', '')}
        Feature: {state.get('affected_feature', '')}
        Summary: {state.get('issue_summary', '')}
        Severity: {state.get('severity', '')}
        Description: {state['bug_description']}
        """,
    )

    causes = data.get("possible_causes", [])

    if not isinstance(causes, list):
        causes = [str(causes)]

    return {"possible_causes": [str(cause) for cause in causes[:4]]}


# NODE 4: Format the final bug report
def format_report_node(state: BugReportState) -> dict:
    report = f"""
# Bug Report

## Bug Title
{state.get('bug_title', 'Not available')}

## Affected Feature
{state.get('affected_feature', 'Not available')}

## Issue Summary
{state.get('issue_summary', 'Not available')}

## Severity
{state.get('severity', 'Not available')}

## Severity Reason
{state.get('severity_reason', 'Not available')}

## Possible Root Causes
""" + "\n".join(
        f"- {cause}" for cause in state.get("possible_causes", [])
    )

    return {"formatted_report": report.strip()}
