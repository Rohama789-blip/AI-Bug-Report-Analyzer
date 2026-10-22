
from langgraph.graph import StateGraph, START, END

from state import BugReportState
from nodes import (
    bug_analysis_node,
    severity_detection_node,
    root_cause_node,
    format_report_node,
)


def build_bug_report_graph():
    workflow = StateGraph(BugReportState)

    workflow.add_node("bug_analysis", bug_analysis_node)
    workflow.add_node("severity_detection", severity_detection_node)
    workflow.add_node("root_cause", root_cause_node)
    workflow.add_node("format_report", format_report_node)

    workflow.add_edge(START, "bug_analysis")
    workflow.add_edge("bug_analysis", "severity_detection")
    workflow.add_edge("severity_detection", "root_cause")
    workflow.add_edge("root_cause", "format_report")
    workflow.add_edge("format_report", END)

    return workflow.compile()


# This variable is imported by main.py
bug_report_graph = build_bug_report_graph()
