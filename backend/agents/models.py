import os
import asyncio
import re
from typing import Optional, Any
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage, AIMessage
from pydantic import BaseModel, Field

from langchain_core.outputs import ChatResult, ChatGeneration
from agents.mock_templates import get_mock_artifact

# Global variable to store active user idea throughout transaction lifecycle
CURRENT_IDEA = "Fitness Coaching Platform"

class MockChatModel(BaseChatModel):
    """A mock model that returns highly-detailed, domain-aware responses for demo purposes."""
    model_name: str = "mock-model"
    
    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        content = "Mock response: The agent successfully processed your request."
        message = AIMessage(content=content)
        generation = ChatGeneration(message=message)
        return ChatResult(generations=[generation])
        
    async def _agenerate(self, messages, stop=None, run_manager=None, **kwargs):
        global CURRENT_IDEA
        
        # Simulate realistic thinking time
        await asyncio.sleep(2.5)
        
        # Determine agent type from prompt keywords
        prompt_text = ""
        for msg in messages:
            if isinstance(msg, BaseMessage):
                prompt_text += "\n" + msg.content
            elif hasattr(msg, "content"):
                prompt_text += "\n" + str(msg.content)
            else:
                prompt_text += "\n" + str(msg)
                
        # Parse product idea if available in the first prompts
        idea_match = re.search(r"Product Idea:\s*(.*)", prompt_text, re.IGNORECASE)
        if idea_match:
            CURRENT_IDEA = idea_match.group(1).strip()
            # Clean possible tailing markers
            CURRENT_IDEA = CURRENT_IDEA.split("\n")[0].strip()

        agent_id = "general"
        if "Product Requirements Document" in prompt_text or "Product Vision" in prompt_text:
            agent_id = "pm"
        elif "Market Research Analyst" in prompt_text or "Competitors" in prompt_text:
            agent_id = "research"
        elif "System Architect" in prompt_text or "PRD:" in prompt_text:
            agent_id = "architect"
        elif "Database Engineer" in prompt_text or "relational database schema" in prompt_text:
            agent_id = "database"
        elif "Backend Engineer" in prompt_text or "FastAPI" in prompt_text:
            agent_id = "backend"
        elif "Frontend Engineer" in prompt_text or "React Component" in prompt_text or "UI/UX structure" in prompt_text:
            agent_id = "frontend"
        elif "QA Engineer" in prompt_text or "test strategy" in prompt_text:
            agent_id = "qa"
        elif "Software Engineer Reviewer" in prompt_text or "critique the outputs" in prompt_text:
            agent_id = "reviewer"
            
        # Get highly rich, domain-aware mock template
        content = get_mock_artifact(agent_id, CURRENT_IDEA)
        
        message = AIMessage(content=content)
        generation = ChatGeneration(message=message)
        return ChatResult(generations=[generation])

    @property
    def _llm_type(self) -> str:
        return "mock"

class ModelConfig(BaseModel):
    model_name: str = Field(default="llama-3.3-70b-versatile")
    api_base: str = Field(default="https://api.groq.com/openai/v1")
    api_key: str = Field(default="EMPTY")
    temperature: float = Field(default=0.7)

class ResilientChatModel(BaseChatModel):
    """A wrapper that catches errors during ainvoke/invoke and falls back to mock."""
    base_model: BaseChatModel
    mock_model: MockChatModel = Field(default_factory=MockChatModel)
    
    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        try:
            return self.base_model._generate(messages, stop, run_manager, **kwargs)
        except Exception:
            return self.mock_model._generate(messages, stop, run_manager, **kwargs)
            
    async def _agenerate(self, messages, stop=None, run_manager=None, **kwargs):
        try:
            return await self.base_model._agenerate(messages, stop, run_manager, **kwargs)
        except Exception as e:
            print(f"Fallback to Mock Mode due to error: {e}")
            return await self.mock_model._agenerate(messages, stop, run_manager, **kwargs)

    @property
    def _llm_type(self) -> str:
        return f"resilient({self.base_model._llm_type})"

def get_model(config: Optional[ModelConfig] = None):
    if config is None:
        config = ModelConfig(
            model_name=os.getenv("MODEL_NAME", "llama-3.3-70b-versatile"),
            api_base=os.getenv("MODEL_API_BASE", "https://api.groq.com/openai/v1"),
            api_key=os.getenv("MODEL_API_KEY", "EMPTY"),
            temperature=float(os.getenv("MODEL_TEMPERATURE", "0.7"))
        )
    
    # Check if we should use mock mode
    if os.getenv("USE_MOCK_LLM", "false").lower() == "true":
        return MockChatModel()
        
    base_model = ChatOpenAI(
        model=config.model_name,
        base_url=config.api_base, # Modern LangChain binding parameters
        api_key=config.api_key,   # Modern LangChain binding parameters
        temperature=config.temperature,
        streaming=True,
    )
    
    if os.getenv("FALLBACK_TO_MOCK", "true").lower() == "true":
        return ResilientChatModel(base_model=base_model)
        
    return base_model
