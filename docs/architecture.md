# DevPilot System Architecture

DevPilot uses a **Stateful Multi-Agent Orchestration** pattern to handle the complexity of software product planning.

## 1. Orchestration Layer (LangGraph)
We use **LangGraph** to manage the state and control flow between specialized agents. Unlike simple linear chains, LangGraph allows for:
- **Cyclic Workflows**: Agents can loop back for reviews and corrections.
- **State Management**: A persistent `AgentState` object tracks the PRD, architecture, and code across all nodes.
- **Async Execution**: Nodes can run concurrently where possible (e.g., frontend and backend scaffolding).

## 2. Agent Swarm Roles

| Agent | Responsibility | Output |
| :--- | :--- | :--- |
| **Product Manager** | Defines core features and user stories. | PRD (Markdown) |
| **Research Agent** | Analyzes market trends and competitor features. | Market Report |
| **System Architect** | Designs high-level system diagrams and components. | Architecture Spec |
| **Database Engineer** | Creates ERDs and SQL schemas. | Database Schema |
| **Backend Engineer** | Generates FastAPI/Node.js API structures. | Backend Code |
| **Frontend Engineer** | Creates UI component specifications and Next.js code. | Frontend Code |
| **QA Engineer** | Develops testing strategies and checklists. | QA Plan |
| **Reviewer Agent** | Critiques all previous outputs for consistency. | Critique Report |

## 3. Communication Protocol
The system communicates via **WebSockets** for real-time interactivity:
- **`agent_update`**: Sent whenever an agent starts or finishes a task.
- **`state_update`**: Streams partial results (e.g., half-finished PRDs) to the UI.
- **`workflow_complete`**: Final signal to enable the "Download ZIP" action.

## 4. Hardware Abstraction (ROCm/vLLM)
DevPilot is designed to be hardware-agnostic:
- **Standard**: Connects to OpenAI/Anthropic via standard API keys.
- **Local (AMD)**: Optimized for ROCm-enabled servers using **vLLM**, allowing for high-throughput local model serving with Qwen-2.5 or Llama-3.

## 5. Export Pipeline
When the workflow completes, the `/api/export` endpoint:
1. Collects all strings from the current `AgentState`.
2. Packages them into a structured directory (docs, frontend, backend).
3. Streams a `ZIP` file back to the client for immediate use as a starter repository.
