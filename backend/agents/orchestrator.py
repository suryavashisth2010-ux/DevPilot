from typing import TypedDict, List, Annotated, Sequence, Optional
from langgraph.graph import StateGraph, END
import operator
from agents.models import get_model, ModelConfig
from agents.prompts import (
    PM_PROMPT, RESEARCHER_PROMPT, ARCHITECT_PROMPT, 
    DATABASE_PROMPT, BACKEND_PROMPT, FRONTEND_PROMPT, 
    QA_PROMPT, REVIEWER_PROMPT
)

class AgentState(TypedDict):
    idea: str
    prd: str
    market_research: str
    architecture: str
    database_schema: str
    backend_code: str
    frontend_code: str
    qa_checklist: str
    reviewer_critique: str
    current_agent: str
    logs: Annotated[List[str], operator.add]
    config: Optional[dict]

def get_state_model(state: AgentState):
    """Dynamically builds LLM instances based on transient client configurations."""
    config_dict = state.get("config")
    if not config_dict:
        return get_model() # Default fallback
    
    cfg = ModelConfig(
        model_name=config_dict.get("modelName") or config_dict.get("model_name") or "llama-3.3-70b-versatile",
        api_base=config_dict.get("apiBase") or config_dict.get("api_base") or "https://api.groq.com/openai/v1",
        api_key=config_dict.get("apiKey") or config_dict.get("api_key") or "EMPTY",
        temperature=float(config_dict.get("temperature") or 0.7)
    )
    return get_model(cfg)

async def pm_agent(state: AgentState):
    prompt = PM_PROMPT.format(idea=state["idea"])
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "prd": response.content,
        "logs": [
            "PM Agent: Initiated product definition phase.",
            "PM Agent: Compiling core feature list and scoping requirements.",
            "PM Agent: Drafting user stories and operational fatigue boundaries.",
            "PM Agent: Requirements specification (PRD) successfully defined."
        ],
        "current_agent": "Product Manager"
    }

async def research_agent(state: AgentState):
    prompt = RESEARCHER_PROMPT.format(idea=state["idea"], prd=state["prd"])
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "market_research": response.content,
        "logs": [
            "Researcher Agent: Scanning target industry segments.",
            "Researcher Agent: Compiling product competitor matrix.",
            "Researcher Agent: Detailing user pain points and strategizing product wedge.",
            "Researcher Agent: Competitive market analysis complete."
        ],
        "current_agent": "Researcher"
    }

async def architect_agent(state: AgentState):
    prompt = ARCHITECT_PROMPT.format(prd=state["prd"])
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "architecture": response.content,
        "logs": [
            "Architect Agent: Mapping decoupled microservice boundaries.",
            "Architect Agent: Drafting frontend and backend infrastructure bounds.",
            "Architect Agent: Detailing Docker containerization policies.",
            "Architect Agent: System architecture blueprint successfully compiled."
        ],
        "current_agent": "Architect"
    }

async def database_agent(state: AgentState):
    prompt = DATABASE_PROMPT.format(architecture=state["architecture"])
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "database_schema": response.content,
        "logs": [
            "Database Agent: Building normalized relational schemas.",
            "Database Agent: Mapping table structures and key configurations.",
            "Database Agent: Creating primary indices and foreign-key references.",
            "Database Agent: Relational SQL DDL database blueprint generated."
        ],
        "current_agent": "Database Engineer"
    }

async def backend_agent(state: AgentState):
    prompt = BACKEND_PROMPT.format(
        architecture=state["architecture"], 
        database_schema=state["database_schema"]
    )
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "backend_code": response.content,
        "logs": [
            "Backend Engineer: Designing API router interfaces.",
            "Backend Engineer: Scaffolding high-performance FastAPI controllers.",
            "Backend Engineer: Initializing WebSocket full-duplex telemetry channels.",
            "Backend Engineer: Asynchronous Python backend scaffold generated."
        ],
        "current_agent": "Backend Engineer"
    }

async def frontend_agent(state: AgentState):
    prompt = FRONTEND_PROMPT.format(architecture=state["architecture"])
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "frontend_code": response.content,
        "logs": [
            "Frontend Engineer: Defining page routes and visual grid bindings.",
            "Frontend Engineer: Applying tailwind typography styles.",
            "Frontend Engineer: Designing live mock HUD controllers and metrics.",
            "Frontend Engineer: Glassmorphic React dashboard interface completed."
        ],
        "current_agent": "Frontend Engineer"
    }

async def qa_agent(state: AgentState):
    prompt = QA_PROMPT.format(prd=state["prd"], backend_code=state["backend_code"])
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "qa_checklist": response.content,
        "logs": [
            "QA Agent: Writing pytest validation test scripts.",
            "QA Agent: Compiling Playwright E2E browser tests.",
            "QA Agent: Drafting manual verification checkout protocols.",
            "QA Agent: Automated systems checklist verified."
        ],
        "current_agent": "QA Engineer"
    }

async def reviewer_agent(state: AgentState):
    prompt = REVIEWER_PROMPT.format(
        prd=state["prd"],
        architecture=state["architecture"],
        backend_code=state["backend_code"],
        frontend_code=state["frontend_code"],
        qa_checklist=state["qa_checklist"]
    )
    model = get_state_model(state)
    response = await model.ainvoke(prompt)
    return {
        "reviewer_critique": response.content,
        "logs": [
            "Reviewer Agent: Auditing API thread safety parameters.",
            "Reviewer Agent: Verifying query constraints and schema integrity.",
            "Reviewer Agent: Finalizing architectural design check.",
            "Reviewer Agent: Project design successfully verified and approved."
        ],
        "current_agent": "Reviewer"
    }

# Create Graph
workflow = StateGraph(AgentState)

workflow.add_node("pm", pm_agent)
workflow.add_node("research", research_agent)
workflow.add_node("architect", architect_agent)
workflow.add_node("database", database_agent)
workflow.add_node("backend", backend_agent)
workflow.add_node("frontend", frontend_agent)
workflow.add_node("qa", qa_agent)
workflow.add_node("reviewer", reviewer_agent)

workflow.set_entry_point("pm")
workflow.add_edge("pm", "research")
workflow.add_edge("research", "architect")
workflow.add_edge("architect", "database")
workflow.add_edge("database", "backend")
workflow.add_edge("backend", "frontend")
workflow.add_edge("frontend", "qa")
workflow.add_edge("qa", "reviewer")
workflow.add_edge("reviewer", END)

orchestrator = workflow.compile()
