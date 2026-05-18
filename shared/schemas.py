from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AgentLog(BaseModel):
    agent: str
    message: str
    time: str

class AgentStateSchema(BaseModel):
    idea: str
    prd: Optional[str] = ""
    market_research: Optional[str] = ""
    architecture: Optional[str] = ""
    database_schema: Optional[str] = ""
    backend_code: Optional[str] = ""
    frontend_code: Optional[str] = ""
    qa_checklist: Optional[str] = ""
    reviewer_critique: Optional[str] = ""
    current_agent: Optional[str] = ""
    logs: List[str] = []

class WebSocketMessage(BaseModel):
    type: str
    idea: Optional[str] = None
    agent: Optional[str] = None
    logs: Optional[List[str]] = None
    state: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    config: Optional[Dict[str, Any]] = None

class ProjectExportRequest(BaseModel):
    prd: str
    architecture: str
    database_schema: str
    backend_code: str
    frontend_code: str
    qa_checklist: str
