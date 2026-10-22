
from typing import TypedDict


class BugReportState(TypedDict, total=False):
    bug_description: str
    bug_title: str
    affected_feature: str
    issue_summary: str
    severity: str
    severity_reason: str
    possible_causes: list[str]
    formatted_report: str
    error: str
