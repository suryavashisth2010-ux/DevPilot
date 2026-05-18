# DevPilot — AI Multi-Agent Product-to-Engineering Planning System

## Overview
DevPilot is a premium AI-powered software engineering copilot designed to transform a simple startup or product idea into a structured engineering blueprint, technical architecture, implementation roadmap, and starter repository scaffold through a coordinated swarm of specialized AI agents.

Instead of acting like a normal chatbot, DevPilot simulates a real engineering organization:
- **Product Managers** define requirements
- **Researchers** analyze the market
- **Architects** design systems
- **Database Engineers** create schemas
- **Backend Engineers** define APIs
- **Frontend Engineers** scaffold UI structure
- **QA Agents** validate implementation quality
- **Reviewers** critique and refine outputs

The platform visualizes this orchestration live through an interactive workflow graph and real-time telemetry interface inspired by modern AI developer tooling such as Cursor, Vercel, Linear, and OpenAI Operator systems.

---

## Core Idea

### Input
A user enters a product idea such as:
> *"Build an AI-powered fitness coaching platform"*

### Process
DevPilot processes it through a coordinated multi-agent workflow:
- AI multi-agent orchestration
- Live workflow coordination
- Architecture planning
- System analysis
- Schema generation
- Scaffold planning
- Repository export preparation

### Output
DevPilot generates a complete engineering package:
- **Product Requirement Document (PRD)**
- **Technical architecture & stack recommendations**
- **Database schema & SQL table definitions**
- **API routes & starter folder structures**
- **Docker configuration previews**
- **Downloadable ZIP starter repository scaffold**

---

## Main System Components

### 1. Multi-Agent Orchestration Engine
The orchestration layer coordinates specialized AI agents through a graph-based workflow system powered by LangGraph.

**Agents Include:**
- Product Manager Agent
- Research Agent
- Architect Agent
- Database Agent
- Backend Engineer Agent
- Frontend Engineer Agent
- QA Agent
- Reviewer Agent

Each agent features its own state management, dependencies, execution lifecycle, streaming outputs, and telemetry status.

### 2. Live Workflow Visualization
One of DevPilot’s signature features. The orchestration process is displayed through an interactive React Flow graph.

**Features:**
- Animated execution paths
- Branching architecture flows
- Glowing active nodes
- Dependency-aware waiting states
- Runtime timers
- Active signal-flow edges

**Agent States:**
Agents dynamically transition through the following states to simulate a real engineering division:
`WAITING` ➔ `THINKING` ➔ `STREAMING` ➔ `REVIEWING` ➔ `BLOCKED` ➔ `DONE`

### 3. Real-Time Telemetry Console
The right-side orchestration panel acts as a live execution console.

**Features:**
- Streaming typewriter-style logs with auto-scroll
- Timestamped execution and categorized logs
- Active blinking execution cursor
- Compact telemetry timeline

**Example Trace:**
```text
[ARCHITECT] Designing microservice boundaries...
[DATABASE ENGINEER] Generating relational schema...
[BACKEND ENGINEER] Preparing API routing structure...
```

### 4. Product Blueprint Generation System
DevPilot produces multiple structured engineering artifacts organized into tabs:
- **Workflow**: Live orchestration visualization.
- **Specification**: Complete PRD with features, user stories, requirements, and acceptance criteria.
- **Architecture**: Frontend/Backend stack details, auth strategies, deployment configurations, and Docker settings.
- **Database Schema**: SQL previews, table structures, and an interactive ERD relationship diagram.
- **Code Scaffold**: Live interactive directory tree, routing previews, and Docker setup.

### 5. Repository Export Engine
DevPilot packages all generated blueprints and assets into a downloadable starter repository ZIP, seamlessly bridging the gap between **idea ➔ implementation**.
- Frontend scaffold
- Backend scaffold
- Configuration files & Docker setups
- Markdown specifications

---

## Technology Stack

### Frontend
- **Built With**: Next.js 14, Tailwind CSS, React Flow, Framer Motion, shadcn/ui.
- **UI Philosophy**: Glassmorphism, cinematic telemetry, operational realism, and premium AI developer aesthetics (inspired by Cursor, Linear, Vercel, and modern observability dashboards).

### Backend
- **Built With**: FastAPI, WebSockets, Pydantic, LangGraph.
- **Responsibilities**: swarms orchestration, live telemetry broadcasting, schema validation, and ZIP export generation.

### AI Inference Layer
Interchangeable cloud or local LLM engine support:
- Groq Cloud API
- OpenAI Platform
- Local Ollama
- Any vLLM-compatible OpenAI endpoint

---

## Deployment Architecture
- **Frontend**: Vercel
- **Backend**: Render or Railway

---

## Key Differentiator
Most AI tools generate standalone **code snippets**. **DevPilot generates entire engineering systems**. It focuses on technical planning, swarm orchestration, architecture design, and structural scaffolding rather than simple line-by-line autocomplete.

---

## Current Status
DevPilot currently functions as a premium AI orchestration simulator, engineering blueprint generator, real-time multi-agent visualizer, and technical repository scaffold planner with a highly polished, production-style developer interface.
