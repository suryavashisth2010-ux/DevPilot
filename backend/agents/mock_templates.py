import re

def get_product_domain(idea: str) -> str:
    idea_lower = idea.lower()
    if any(k in idea_lower for k in ["fitness", "workout", "gym", "coach", "health", "exercise", "run", "track", "sport", "diet"]):
        return "fitness"
    elif any(k in idea_lower for k in ["chat", "bot", "clone", "assistant", "ai", "conversation", "gpt", "agent", "nlp"]):
        return "chat"
    elif any(k in idea_lower for k in ["shop", "store", "commerce", "sell", "checkout", "buy", "retail", "fashion", "boutique", "marketplace"]):
        return "ecommerce"
    elif any(k in idea_lower for k in ["crm", "kanban", "project", "manage", "task", "trello", "jira", "tracker", "workflow"]):
        return "crm"
    else:
        return "general"

def clean_idea(idea: str) -> str:
    # Extract clean product name
    cleaned = re.sub(r'^(build a|create a|make a|i want a|design a|build an|create an|make an|i want an|design an)\s+', '', idea, flags=re.IGNORECASE)
    return cleaned.strip().title()

def get_mock_artifact(agent_id: str, idea: str) -> str:
    domain = get_product_domain(idea)
    name = clean_idea(idea)
    
    if agent_id == "pm":
        return get_pm_template(domain, name)
    elif agent_id == "research":
        return get_research_template(domain, name)
    elif agent_id == "architect":
        return get_architect_template(domain, name)
    elif agent_id == "database":
        return get_database_template(domain, name)
    elif agent_id == "backend":
        return get_backend_template(domain, name)
    elif agent_id == "frontend":
        return get_frontend_template(domain, name)
    elif agent_id == "qa":
        return get_qa_template(domain, name)
    elif agent_id == "reviewer":
        return get_reviewer_template(domain, name)
    return "No template available."

def get_pm_template(domain: str, name: str) -> str:
    if domain == "fitness":
        return f"""# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project: {name} (AI-Powered Fitness Coaching Platform)
**Author**: DevPilot PM Swarm Agent
**Status**: APPROVED
**Date**: May 2026

---

### 1. Executive Summary
{name} is a high-performance, premium AI-powered fitness coaching platform designed to democratize elite personal training. By combining real-time pose-estimation, biometric data ingestion, and conversational AI trainers, the system tailors dynamic workout routines, checks form, and constructs bespoke nutrition roadmaps.

### 2. Core Features
- **AI Workout Coach**: Dynamic, real-time pose-estimation checking barbell form (squats, deadlifts) and providing voice feedback.
- **Biometric Analytics**: Integration with Apple Watch, Whoop, and Garmin to track Heart Rate Variability (HRV), sleep, and recovery.
- **Dynamic Meal Planner**: Conversational calorie and macronutrient planner adjusting dynamically based on active calorie expenditure.
- **Trainer Marketplace**: Premium video consultation booking for human-in-the-loop coaching reviews.

### 3. User Stories
- *As a busy professional*, I want to follow a personalized 20-minute workout that automatically adapts to my fatigue level so that I can stay consistent without burning out.
- *As an intermediate lifter*, I want instant pose feedback on my heavy squats so that I can prevent lower back injuries.
- *As a trainer*, I want a high-fidelity telemetry board of my clients' workouts so that I can offer precise advice.

### 4. Technical Requirements & Specs
- **Biometric Sync Latency**: Data synchronization must complete within 2 seconds of watch workout termination.
- **Pose Detection Accuracy**: Real-time Keypoint coordinate drift must not exceed 5% under ordinary living room illumination.

### 5. Acceptance Criteria
```gherkin
Scenario: Dynamic Workout Fatigue Adjustment
  Given a user with a daily HRV recovery score of 35% (low)
  When they launch the daily workout routine
  Then the system must scale down active work sets by 30%
  And recommend a mobility-focused recovery session instead
```"""
    elif domain == "chat":
        return f"""# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project: {name} (Conversational AI Platform)
**Author**: DevPilot PM Swarm Agent
**Status**: APPROVED
**Date**: May 2026

---

### 1. Executive Summary
{name} is an enterprise-grade conversational AI assistant hub designed to deploy contextual, role-specific swarms for customer support, technical assistance, and cognitive drafting. It supports multi-modal pipelines, robust local model configuration, and persistent vector-store memories.

### 2. Core Features
- **Swarm Creator**: Visual interface to define customized agent cards, custom prompts, model routes, and tools.
- **Persistent Shared Memory**: Hybrid caching leveraging Redis for fast context and pgvector for long-term retrieval-augmented generation (RAG).
- **Multi-Modal Sandbox**: Uploading specifications, images, and raw logs for instant document synthesis.
- **Telemetry Console**: Rich monitoring logs showing agent reasoning paths, token speeds, and API costs in real time.

### 3. User Stories
- *As a support lead*, I want to create a localized agent equipped with product documentation so that it resolves 80% of routine client questions.
- *As a developer*, I want to toggle between Groq, OpenAI, and Ollama so that I can balance speed, cost, and security.

### 4. Technical Requirements
- **Latency Budget**: LLM tokens must stream at a minimum rate of 40 tokens/sec for cloud endpoints and 20 tokens/sec for local endpoints.
- **Context Injection**: Shared RAG search must return top-k matches within 250ms of user input query receipt.

### 5. Acceptance Criteria
```gherkin
Scenario: Enterprise Agent Tool Invocations
  Given an active customer support chat
  When a user requests a refund lookup
  Then the agent must correctly invoke the Stripe API tool
  And format the transaction history cleanly as a responsive table
```"""
    elif domain == "ecommerce":
        return f"""# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project: {name} (Premium Digital Marketplace)
**Author**: DevPilot PM Swarm Agent
**Status**: APPROVED
**Date**: May 2026

---

### 1. Executive Summary
{name} is a state-of-the-art, lightning-fast digital storefront and luxury curation marketplace. Featuring ultra-low latency navigation, interactive visual merchandising, conversational sales assistants, and fully optimized single-click stripe checkout integrations.

### 2. Core Features
- **Conversational Concierge**: Visual AI assistant helping shoppers match products based on size, style preferences, and mood.
- **Dynamic Grid Layout**: Glassmorphic, highly responsive grid with interactive product carousels, size filters, and instant additions.
- **Single-Click Checkout**: Direct integration with Stripe Link, Google Pay, and WhatsApp status confirmations.
- **Merchant Observability**: Real-time telemetry dashboard detailing active store conversions, cart abandonment logs, and stock alerts.

### 3. User Stories
- *As a style-conscious shopper*, I want to ask an AI concierge to "find a warm streetwear jacket that goes with blue denim" and get styled recommendations.
- *As a store owner*, I want an instant dashboard summarizing today's active sales and stock drop notifications.

### 4. Technical Requirements
- **Core Web Vitals**: Largest Contentful Paint (LCP) must remain below 1.2s on standard mobile connections.
- **Real-Time Synchronicity**: Inventory counts must synchronize across all client active sessions within 500ms of checkout completion.

### 5. Acceptance Criteria
```gherkin
Scenario: Visual AI Recommendation Curation
  Given a user asking for custom luxury styling advice
  When the search payload is analyzed by the AI Concierge
  Then the storefront grid must smoothly filter for matching styles
  And present a curated lookbook card with add-to-cart shortcuts
```"""
    elif domain == "crm":
        return f"""# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project: {name} (Autonomous Project Planner)
**Author**: DevPilot PM Swarm Agent
**Status**: APPROVED
**Date**: May 2026

---

### 1. Executive Summary
{name} is a premium CRM and autonomous project tracking workspace inspired by modern developer platforms like Linear. It coordinates workspace workflows, maps issue backlogs, tracks developer velocities, and uses automated AI agents to pre-triage incoming tickets.

### 2. Core Features
- **Command Menu & Shortcuts**: Keyboard-driven workspace navigation enabling issue creation, filtering, and assignment in under 3 seconds.
- **Autonomous Backlog Triage**: AI agent reviewing incoming issues, assigning correct priority badges, tagging team members, and generating skeleton subtasks.
- **Interactive Kanban Board**: Sleek card layout with glassmorphic cards, drag-and-drop transitions, and collaborative telemetry cursors.
- **Sprint Forecasting**: Biometric developer velocity charts predicting sprint completion dates with confidence margins.

### 3. User Stories
- *As a product manager*, I want the system to automatically triage raw customer feedback and turn them into detailed, assigned engineering tickets.
- *As a developer*, I want to use standard Vercel-style hotkeys to move tickets through lanes without touching my mouse.

### 4. Technical Requirements
- **Keyboard Interactions**: Event processing latency for command menu calls must be under 30ms.
- **State Synchronization**: Collaborative card drags must render seamlessly for other co-viewing users within 100ms.

### 5. Acceptance Criteria
```gherkin
Scenario: Automatic Issue Pre-Triaging
  Given a customer bug report stating "Checkout crashes on mobile"
  When the AI Triage Agent processes the issue
  Then the ticket must be assigned to "Engineering Squad"
  And the priority must be escalated to "HIGH"
  And a subtask list detailing mobile testing points must be generated
```"""
    else:
        return f"""# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project: {name} (Autonomous Developer Tool)
**Author**: DevPilot PM Swarm Agent
**Status**: APPROVED
**Date**: May 2026

---

### 1. Executive Summary
{name} is a high-performance system planning, orchestration, and software scaffolding engine. Designed to elevate the architectural phase by automating PRD compilation, system modeling, database normalizing, and clean repository deployments.

### 2. Core Features
- **Swarm Orchestrator**: langgraph agent swarm dividing tasks among PMs, Architects, Engineers, and QA.
- **Visual Node Canvas**: Interactive flow charts tracking node execution times, blockages, and active feedback cycles.
- **Interactive Scaffolder**: Code view panel with hierarchical folder navigation and instant ZIP compilation.
- **Telemetry Console**: Live typewriter trace recording streaming responses and raw token statistics.

### 3. User Stories
- *As a startup founder*, I want to turn my abstract ideas into complete, structurally sound code scaffolds in 30 seconds.
- *As a lead engineer*, I want high-fidelity system blueprints and normalized database SQL files that I can instantly deploy.

### 4. Technical Requirements
- **WebSocket Handshake**: Connection negotiations must resolve in under 150ms under normal network conditions.
- **Scaffold Packing**: ZIP file creation and stream serialization must complete under 1.5s for standard templates.

### 5. Acceptance Criteria
```gherkin
Scenario: Orchestrating an Engineering Scaffold
  Given an abstract SaaS product idea
  When the user triggers the orchestration flow
  Then the swarm must step through PM, Architect, Database, and QA nodes
  And generate fully compliant code scripts and database statements
```"""

def get_research_template(domain: str, name: str) -> str:
    return f"""# MARKET RESEARCH & COMPETITIVE ANALYSIS

## Target Product: {name}
**Prepared by**: DevPilot Market Researcher Agent
**Target Audience**: Seed Investors, Engineering Leads, Product Teams

---

### 1. Market Sizing & Trends
The global market for systems in the **{domain}** sector is experiencing exponential compound annual growth (CAGR of 24.2%). With the rapid reduction in LLM inference costs (token costs falling 10x yearly) and the rise of local hardware acceleration, modern organizations are shifting from generic web portals to autonomous, context-aware platforms.

### 2. Competitor Matrix

| Competitor | Strengths | Weaknesses | Our Strategic Wedge |
| :--- | :--- | :--- | :--- |
| **Legacy Giants** | Brand trust, deep pockets | Extremely slow innovation, rigid pricing | Lower pricing, modular open architectures |
| **Niche Startups** | Sleek frontends, rapid releases | High churn rates, zero system integrations | Deep data synchronization, visual telemetry |
| **Custom In-house**| High customization | Exorbitant engineering costs, tech debt | Immediate code scaffolding, standard templates |

### 3. User Pain Points
1. **Tool Fragmentation**: Users must constantly context-switch between disconnected telemetry logs, design systems, and database charts.
2. **"Black Box" AI**: Chatbots generate code snippets with zero architectural visibility, leaving developers in the dark about decisions.
3. **Rigid Deployments**: Existing builders package code into proprietary sandboxes, preventing developers from exporting standard Docker packages.

### 4. Strategic Positioning for {name}
- **Observability First**: Visualizing every agent thought, API route, and relational index, building developer confidence.
- **Interoperability**: Standard FastAPI + React + Next.js template exports that can be hosted on Render, Vercel, or local servers.
- **Extensibility**: Supporting Groq, OpenAI, Ollama, and local endpoints through a unified, interchangeable LLM abstraction layer.
"""

def get_architect_template(domain: str, name: str) -> str:
    if domain == "fitness":
        return f"""# TECHNICAL ARCHITECTURE SPECIFICATION

## Project: {name}
**Lead Architect**: DevPilot Architect Agent
**Status**: APPROVED

---

### 1. System Topology Overview
{name} leverages a modern decoupling pattern. The frontend is built on **Next.js 14** (App Router) styled with **TailwindCSS** and animated via **Framer Motion**. The backend is powered by **FastAPI** handling WebSockets for streaming pose telemetry and biome data.

```mermaid
graph TD
    Client[Next.js Client] -->|WebSocket| Backend[FastAPI Server]
    Backend -->|PubSub| Redis[Redis Queue]
    Backend -->|Query| Postgres[(PostgreSQL + pgvector)]
    Backend -->|Inference| PoseEngine[MediaPipe Pose Estimation]
```

### 2. Modern Technology Stack

- **Frontend Framework**: Next.js 14, React 18, TailwindCSS.
- **Interactive Visuals**: React Flow for graph visualizations, Lucide React for modern iconography.
- **Backend API Engine**: FastAPI (Asynchronous Python), Uvicorn.
- **Real-Time Channel**: Full-Duplex WebSockets for streaming biome data.
- **Database Layer**: PostgreSQL (relational tables) + pgvector (for vector calculations of workout similarities).
- **Caching & Brokers**: Redis for fast session state caches.
- **Containerization**: Docker & Docker Compose.

### 3. Authentication & Security Policy
- JWT-based authentication via HTTP-only secure cookies.
- OAuth2 integration with Google, Apple Watch, and Garmin APIs.
- SHA-256 password hashing via passlib.

### 4. Docker Infrastructure Configuration
We recommend a containerized microservice boundary:
- `web`: Next.js frontend node.
- `api`: FastAPI Python instance.
- `db`: PostgreSQL instance.
- `cache`: Redis key-value store.
"""
    elif domain == "chat":
        return f"""# TECHNICAL ARCHITECTURE SPECIFICATION

## Project: {name}
**Lead Architect**: DevPilot Architect Agent
**Status**: APPROVED

---

### 1. System Topology Overview
{name} utilizes a highly responsive event-driven model designed to optimize multi-agent task distribution. The backend orchestrates dynamic chains, formats agent states, and streams token frames via asynchronous WebSocket loops.

```mermaid
graph TD
    Client[Next.js Client] -->|WS Connection| FastApi[FastAPI Server]
    FastApi -->|State Management| LangGraph[LangGraph Swarm]
    LangGraph -->|Vector Queries| PG[(PostgreSQL + pgvector)]
    LangGraph -->|API Requests| Groq[Groq / OpenAI API]
```

### 2. Technology Stack

- **Frontend Core**: Next.js 14, TailwindCSS, Framer Motion.
- **AI Coordination Engine**: FastAPI, Pydantic, LangChain/LangGraph.
- **Database Engine**: PostgreSQL + pgvector (saving prompt completions and document embeddings).
- **Persistent State**: Redis for active WebSocket session lists and token bucket rate limiters.
- **Inference Router**: Abstracted LLM Client support (Groq, OpenAI, Ollama).

### 3. RAG Architecture
- Text splitting using LangChain RecursiveCharacterTextSplitter.
- Embeddings generated via OpenAI text-embedding-3-small or local Ollama embeddings.
- Similarity metrics calculated using HNSW index cosine distance.

### 4. Security & Compliance
- Role-Based Access Control (RBAC) governing agent write access.
- HTTPS/WSS encryption across all external transactions.
"""
    elif domain == "ecommerce":
        return f"""# TECHNICAL ARCHITECTURE SPECIFICATION

## Project: {name}
**Lead Architect**: DevPilot Architect Agent
**Status**: APPROVED

---

### 1. System Topology Overview
{name} focuses heavily on edge latency and instant visual rendering. Product assets are served via global CDNs, page layouts are pre-rendered statically using Next.js ISR (Incremental Static Regeneration), and checkout sessions bypass backend queues by communicating with Stripe elements.

```mermaid
graph TD
    User[Shopper App] -->|CDN| NextJs[Next.js Storefront]
    NextJs -->|API Calls| FastAPI[FastAPI Server]
    FastAPI -->|Inventory Sync| DB[(PostgreSQL Database)]
    User -->|Secure Checkout| Stripe[Stripe Payment Engine]
```

### 2. Technology Stack

- **Storefront**: Next.js 14 (React Server Components), TailwindCSS, Framer Motion.
- **Merchant API Engine**: FastAPI, AsyncPG, Pydantic.
- **Database**: PostgreSQL (normalized relational storage for orders, inventory, and analytics).
- **Asset Storage**: AWS S3 or Cloudflare R2 for responsive image display.
- **Payment Processing**: Stripe Payment Links, Stripe Elements.

### 3. Performance & Caching
- Redis edge caching for active catalog items.
- Dynamic asset resizing via CDNs.
- Client state managed in lightweight, fast Zustand stores.
"""
    elif domain == "crm":
        return f"""# TECHNICAL ARCHITECTURE SPECIFICATION

## Project: {name}
**Lead Architect**: DevPilot Architect Agent
**Status**: APPROVED

---

### 1. System Topology Overview
{name} is built to replicate the rapid keyboard-driven workspace architecture of platforms like Linear. All database reads are heavily indexed, and client states leverage optimistic local updates to make transactions feel instantaneous.

```mermaid
graph TD
    Client[Next.js Workspace] -->|GraphQL / HTTP| FastAPI[FastAPI Engine]
    FastAPI -->|Publish Events| Redis[Redis Broker]
    Redis -->|Push Logs| Telemetry[Observability Dash]
    FastAPI -->|Commit| Postgres[(PostgreSQL Database)]
```

### 2. Technology Stack

- **Workspace Frontend**: Next.js 14, TailwindCSS, Radix UI.
- **Collaboration Sync**: WebSockets for cursor telemetry and ticket state broadcasts.
- **API Architecture**: FastAPI with high-performance routing.
- **Database**: PostgreSQL (Foreign keys, indexes, triggers, and recursive tables for ticket branches).
- **State Management**: Zustand with persistent storage.

### 3. Collaboration Protocol
- Event messaging format using strict JSON payloads containing client cursor coordinates.
- Optimistic updates executed client-side, with rollback hooks on database transaction rejections.
"""
    else:
        return f"""# TECHNICAL ARCHITECTURE SPECIFICATION

## Project: {name}
**Lead Architect**: DevPilot Architect Agent
**Status**: APPROVED

---

### 1. System Topology Overview
Standard microservice layout dividing structural requirements. The frontend serves the interactive workflow boards, while the backend compiles files, spins up docker containers, and manages repo builds.

```mermaid
graph TD
    Client[Next.js UI] -->|API| Backend[FastAPI Server]
    Backend -->|Scaffold Files| FileStorage[Local Volumes]
    Backend -->|Export| ZipEngine[ZIP Compiler]
```

### 2. Technology Stack
- **Web UI**: Next.js 14, React Flow, TailwindCSS.
- **Orchestrator Backend**: FastAPI, Uvicorn, LangGraph.
- **Compilation Engine**: Python standard libraries (zipfile, io).
- **Base Infrastructure**: Docker, Docker Compose.
"""

def get_database_template(domain: str, name: str) -> str:
    if domain == "fitness":
        return """-- =============================================================================
-- SQL DATABASE SCHEMA - FITNESS PLATFORM
-- Target: PostgreSQL 15+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Biometric Profiles Table
CREATE TABLE biometric_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    target_calories INT,
    resting_heart_rate INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. Workout Plans Table
CREATE TABLE workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Exercises Table
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sets INT NOT NULL DEFAULT 3,
    reps INT NOT NULL DEFAULT 10,
    weight_lbs INT DEFAULT 0
);

-- 5. Real-Time Training Sessions Table
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    average_heart_rate INT,
    calories_burned INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_biometrics_user ON biometric_profiles(user_id);
CREATE INDEX idx_workouts_user ON workout_plans(user_id);
CREATE INDEX idx_exercises_plan ON exercises(workout_plan_id);
CREATE INDEX idx_sessions_user ON training_sessions(user_id);"""
    elif domain == "chat":
        return """-- =============================================================================
-- SQL DATABASE SCHEMA - CONVERSATIONAL AI SWARM
-- Target: PostgreSQL 15+ + pgvector
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agents Swarm Table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    system_prompt TEXT NOT NULL,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Chat Conversations Table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Chat Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('user', 'agent', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_agents_name ON agents(name);"""
    elif domain == "ecommerce":
        return """-- =============================================================================
-- SQL DATABASE SCHEMA - PREMIUM STOREFRONT
-- Target: PostgreSQL 15+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Catalog Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INT NOT NULL,
    stock_count INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    stripe_session_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Shipped', 'Cancelled')),
    total_price_cents INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_cents INT NOT NULL
);

-- Indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_items_order ON order_items(order_id);"""
    elif domain == "crm":
        return """-- =============================================================================
-- SQL DATABASE SCHEMA - AUTONOMOUS KANBAN CRM
-- Target: PostgreSQL 15+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Workspace Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Project Issues / Tasks Table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Backlog' CHECK (status IN ('Backlog', 'Todo', 'In_Progress', 'In_Review', 'Done')),
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Issue Subtasks Table
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_issues_assignee ON issues(assignee_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_subtasks_issue ON subtasks(issue_id);"""
    else:
        return """-- =============================================================================
-- SQL DATABASE SCHEMA - SYSTEM PLANNER
-- Target: PostgreSQL 15+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    idea TEXT NOT NULL,
    prd TEXT,
    architecture TEXT,
    database_schema TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blueprints_user ON blueprints(user_id);"""

def get_backend_template(domain: str, name: str) -> str:
    if domain == "fitness":
        return '''# =============================================================================
# FastAPI BACKEND APPLICATION - FITNESS SYSTEM
# =============================================================================
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging

app = FastAPI(title="Fitness Coaching API", version="1.0.0")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FitnessApp")

# Pydantic Schemas
class ExerciseBase(BaseModel):
    name: str
    sets: int
    reps: int
    weight_lbs: int

class WorkoutPlan(BaseModel):
    id: str
    name: str
    difficulty: str
    exercises: List[ExerciseBase]

class BiometricPayload(BaseModel):
    weight_kg: float
    resting_heart_rate: int
    target_calories: int

# Mock Databases
mock_workouts = [
    WorkoutPlan(
        id="w-1",
        name="AI Hypertrophy Day A",
        difficulty="Advanced",
        exercises=[
            ExerciseBase(name="Barbell Squat", sets=4, reps=8, weight_lbs=225),
            ExerciseBase(name="Romanian Deadlift", sets=3, reps=10, weight_lbs=185),
            ExerciseBase(name="Leg Press", sets=3, reps=12, weight_lbs=360)
        ]
    )
]

@app.get("/")
def read_root():
    return {"status": "online", "system": "DevPilot Fitness Swarm"}

@app.get("/api/workouts", response_model=List[WorkoutPlan])
def get_workouts():
    return mock_workouts

@app.post("/api/biometrics")
def save_biometrics(payload: BiometricPayload):
    logger.info(f"Ingested biometric metrics: {payload}")
    return {"message": "Biometrics successfully synchronized", "status": "success"}

# Real-Time Pose Tracking Socket
@app.websocket("/ws/pose")
async def pose_websocket(websocket: WebSocket):
    await websocket.accept()
    logger.info("Pose tracking stream connected")
    try:
        while True:
            # Receives keypoint coordinates from the watch/camera
            data = await websocket.receive_json()
            squat_depth = data.get("squat_depth", 100)
            hip_angle = data.get("hip_angle", 180)
            
            # Form-check algorithm
            form_status = "PERFECT FORM"
            feedback = "Keep pushing!"
            if hip_angle > 120 and squat_depth < 90:
                form_status = "INCOMPLETE DEPTH"
                feedback = "Squat lower! Aim for parallel."
            
            await websocket.send_json({
                "status": form_status,
                "feedback": feedback,
                "calculated_metrics": {
                    "hip_angle": hip_angle,
                    "depth_score": squat_depth
                }
            })
    except WebSocketDisconnect:
        logger.info("Pose tracking stream disconnected")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)'''
    elif domain == "chat":
        return '''# =============================================================================
# FastAPI BACKEND APPLICATION - CONVERSATIONAL AI HUB
# =============================================================================
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json

app = FastAPI(title="Conversational Swarm API", version="1.0.0")

class AgentModel(BaseModel):
    name: str
    role: str
    system_prompt: str
    temperature: float

class MessagePayload(BaseModel):
    sender: str
    content: str

# Mock Agents
mock_agents = [
    AgentModel(
        name="SupportBot",
        role="Customer Tier 1 Support",
        system_prompt="You are a helpful, professional customer support representative...",
        temperature=0.4
    )
]

@app.get("/")
def index():
    return {"status": "online", "agents_loaded": len(mock_agents)}

@app.get("/api/agents", response_model=List[AgentModel])
def get_agents():
    return mock_agents

# WebSocket Multi-Agent Chat Stream
@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            user_message = payload.get("message", "")
            
            # Send initial thinking token
            await websocket.send_json({"type": "status", "content": "Thinking..."})
            await asyncio.sleep(0.8)
            
            # Stream mock typing responses
            reply = f"Thank you for your message. As a specialized Swarm Agent, I have triaged your request: '{user_message}'. How else can I assist you today?"
            await websocket.send_json({"type": "start_stream"})
            for char in reply.split(" "):
                await websocket.send_json({"type": "chunk", "text": char + " "})
                await asyncio.sleep(0.05)
            await websocket.send_json({"type": "end_stream"})
            
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)'''
    elif domain == "ecommerce":
        return '''# =============================================================================
# FastAPI BACKEND APPLICATION - PREMIUM E-COMMERCE ENGINE
# =============================================================================
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Storefront API", version="1.0.0")

class Product(BaseModel):
    id: str
    name: str
    description: str
    price_cents: int
    stock_count: int
    image_url: str

class CheckoutRequest(BaseModel):
    items: List[dict]
    success_url: str
    cancel_url: str

# Mock catalog
mock_catalog = [
    Product(
        id="p-1",
        name="Signature Drop Oversized Hoodie",
        description="Premium heavy-cotton pre-shrunk luxury black hoodie.",
        price_cents=12000,
        stock_count=15,
        image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7"
    ),
    Product(
        id="p-2",
        name="Tailored Double-Breasted Trench",
        description="Sleek, rainproof utility styling trenchcoat.",
        price_cents=28000,
        stock_count=8,
        image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
    )
]

@app.get("/api/products", response_model=List[Product])
def list_products():
    return mock_catalog

@app.post("/api/checkout")
def create_checkout(req: CheckoutRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    # In production, integrate Stripe Checkout session here
    return {
        "checkout_url": "https://checkout.stripe.com/pay/mock_session_key_12345",
        "session_id": "mock_stripe_session_id_54321",
        "message": "Checkout session successfully initialized"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)'''
    elif domain == "crm":
        return '''# =============================================================================
# FastAPI BACKEND APPLICATION - KANBAN CRM ENGINE
# =============================================================================
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI(title="Linear CRM API", version="1.0.0")

class Issue(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    status: str
    priority: str
    assignee: str

# Mock Issues DB
mock_issues = [
    Issue(id="ISS-1", title="Integrate OAuth2 SSO login", status="In_Progress", priority="High", assignee="Sophia Lee"),
    Issue(id="ISS-2", title="Optimize SQL relational queries", status="Todo", priority="Medium", assignee="Marcus Chen"),
    Issue(id="ISS-3", title="Refactor React state hydration", status="Backlog", priority="Low", assignee="Liam Murphy")
]

@app.get("/api/issues", response_model=List[Issue])
def get_issues():
    return mock_issues

@app.post("/api/issues")
def create_issue(issue: Issue):
    mock_issues.append(issue)
    return {"message": "Issue created", "issue": issue}

# WebSocket collaboration channel for mouse cursors and card movement
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/workspace")
async def workspace_socket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Broadcast coordinate telemetry or issue lane movement
            await manager.broadcast(json.dumps(payload))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)'''
    else:
        return '''# =============================================================================
# FastAPI BACKEND APPLICATION - GENERAL SYSTEM
# =============================================================================
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Autonomous Planner API")

class Concept(BaseModel):
    idea: str

@app.get("/")
def read_root():
    return {"status": "online", "framework": "DevPilot Orchestrator"}

@app.post("/api/plan")
def submit_concept(concept: Concept):
    return {"status": "accepted", "message": f"Successfully planned concept: {concept.idea}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)'''

def get_frontend_template(domain: str, name: str) -> str:
    if domain == "fitness":
        return '''// =============================================================================
// Next.js REACT COMPONENT - PREMIUM FITNESS DASHBOARD
// =============================================================================
"use client";

import React, { useState, useEffect } from 'react';
import { Play, Heart, Award, Flame, Activity, Zap, Video, Calendar } from 'lucide-react';

export default function FitnessDashboard() {
  const [heartRate, setHeartRate] = useState(72);
  const [activeCalories, setActiveCalories] = useState(140);
  const [isCoaching, setIsCoaching] = useState(false);
  const [formFeedback, setFormFeedback] = useState("Perfect stance. Awaiting squat depth...");
  const [formScore, setFormScore] = useState(98);

  // Smooth live biometric tracker simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCoaching) {
      interval = setInterval(() => {
        setHeartRate(prev => {
          const delta = Math.floor(Math.random() * 7) - 2;
          return Math.max(110, Math.min(160, prev + delta));
        });
        setActiveCalories(prev => prev + Math.floor(Math.random() * 2) + 1);
        setFormScore(prev => Math.max(90, Math.min(100, prev + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
        
        // Randomly simulate voice form tips
        const tips = [
          "Perfect squat depth! Hip crease below knees.",
          "Keep your chest upright on lift-off.",
          "Drive hard through your heels.",
          "Slow down the eccentric phase.",
          "Exhale on extension!"
        ];
        if (Math.random() > 0.85) {
          setFormFeedback(tips[Math.floor(Math.random() * tips.length)]);
        }
      }, 1000);
    } else {
      setHeartRate(72);
    }
    return () => clearInterval(interval);
  }, [isCoaching]);

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-blue-500/20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />
              FitAI: {name}
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">Pose-Telemetry Personal Coach</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-tight text-zinc-400">BIOMETRIC ENGINE ONLINE</span>
          </div>
        </header>

        {/* Dynamic Biometrics Panel */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Heart Rate", val: `${heartRate} BPM`, desc: isCoaching ? "Target: Zone 3" : "Resting", icon: Heart, color: "text-red-400" },
            { label: "Active Calories", val: `${activeCalories} KCAL`, desc: "Goal: 500 KCAL", icon: Flame, color: "text-orange-400" },
            { label: "Form Accuracy", val: `${formScore}%`, desc: "Barbell Squat Depth", icon: Award, color: "text-yellow-400" },
            { label: "HRV Score", val: "84 ms", desc: "Optimal Recovery", icon: Activity, color: "text-blue-400" },
          ].map((card) => (
            <div key={card.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="mt-4">
                <span className="text-2xl font-mono font-bold tracking-tight text-white">{card.val}</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Central Workspace: Video Feed vs. Routine */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Pose Estimation Screen (Left) */}
          <div className="col-span-8 border border-white/5 rounded-3xl bg-zinc-900/50 p-6 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
            <div className="flex justify-between items-center z-10">
              <span className="px-3 py-1 text-[9px] bg-red-500/10 border border-red-500/20 rounded-full font-bold text-red-400 tracking-widest uppercase">
                {isCoaching ? "LIVE HUD FEED" : "STANDBY FEED"}
              </span>
              <button 
                onClick={() => setIsCoaching(!isCoaching)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isCoaching ? "bg-red-600 hover:bg-red-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {isCoaching ? "Stop Workout" : "Start Live Coach"}
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Simulated camera capture screen */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
              {isCoaching ? (
                <div className="relative w-full h-full border border-blue-500/20 rounded-2xl bg-zinc-950/60 overflow-hidden flex flex-col justify-center items-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse" />
                  
                  {/* Grid lines resembling face/body landmarks */}
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border border-blue-500/40 border-dashed animate-spin duration-3000" />
                  <div className="absolute top-44 left-1/2 -translate-x-1/2 w-48 h-1 bg-blue-500/60" />
                  <div className="absolute top-44 left-1/4 w-12 h-32 border-l border-b border-blue-500/40" />
                  <div className="absolute top-44 right-1/4 w-12 h-32 border-r border-b border-blue-500/40" />
                  
                  <span className="text-zinc-600 text-[10px] font-mono absolute bottom-4">Coordinates mapping: Hip(0.42, 0.72) Knee(0.40, 0.91)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center opacity-30">
                  <Video className="w-12 h-12 text-zinc-500" />
                  <p className="text-xs">Camera standby. Press "Start Live Coach" to launch pose recognition.</p>
                </div>
              )}
            </div>

            {/* Telemetry log feedback */}
            {isCoaching && (
              <div className="z-10 bg-black/80 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Coach Feedback</span>
                </div>
                <p className="text-sm font-semibold text-white animate-fade-in">{formFeedback}</p>
              </div>
            )}

          </div>

          {/* Workout Routine Card (Right) */}
          <div className="col-span-4 border border-white/5 rounded-3xl bg-zinc-900/30 p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Planned routine</h3>
                <Calendar className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="space-y-2">
                {[
                  { name: "Barbell Squats", sets: "4 Sets", reps: "8 Reps", weight: "225 lbs", done: isCoaching },
                  { name: "Romanian Deadlifts", sets: "3 Sets", reps: "10 Reps", weight: "185 lbs", done: false },
                  { name: "Leg Press", sets: "3 Sets", reps: "12 Reps", weight: "360 lbs", done: false },
                ].map((ex, i) => (
                  <div key={ex.name} className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                    ex.done ? "bg-blue-500/5 border-blue-500/20 text-white" : "bg-white/[0.01] border-white/5 text-zinc-400"
                  }`}>
                    <div>
                      <div className="text-xs font-bold">{ex.name}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{ex.sets} × {ex.reps}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-300">{ex.weight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-bold block mb-1">Target Muscles</span>
              <div className="flex gap-1.5 flex-wrap">
                {["Quads", "Glutes", "Hamstrings", "Core"].map(m => (
                  <span key={m} className="px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] text-zinc-400 rounded-md font-mono">{m}</span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}'''
    elif domain == "chat":
        return '''// =============================================================================
// Next.js REACT COMPONENT - CONVERSATIONAL AI HUB
// =============================================================================
"use client";

import React, { useState } from 'react';
import { Send, Bot, User, Shield, Sparkles, MessageSquare, Terminal } from 'lucide-react';

export default function ChatDashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "agent", content: "Greetings! I am the customized Agent Swarm triager. Describe your query and I will route it to the appropriate engineering module." }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: "user", content: userMsg }]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        sender: "agent",
        content: `I have received your request: "${userMsg}". I have initialized the vector search cache and formatted a semantic query payload. How can I help you take this code further?`
      }]);
    }, 1500);
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-purple-500/20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Conversational Hub: {name}
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">Multi-Agent Sandbox Interface</p>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Ollama Local + Groq</span>
          </div>
        </header>

        {/* Chat Window */}
        <div className="border border-white/5 rounded-3xl bg-zinc-900/30 p-6 flex flex-col justify-between h-[450px] shadow-2xl relative">
          
          {/* Scroll Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3.5 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                  msg.sender === 'user' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                  msg.sender === 'user' ? 'bg-purple-950/10 border-purple-500/20 text-zinc-200' : 'bg-white/[0.02] border-white/5 text-zinc-300'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Thinking Overlay indicator */}
            {isThinking && (
              <div className="flex gap-3.5 max-w-[80%] animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-xs font-mono text-zinc-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                  Agent Swarm triage search query executing...
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="mt-4 flex items-center bg-black border border-white/10 rounded-2xl p-1.5 pl-4 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query custom model, command database, or draft code..." 
              className="border-none bg-transparent focus:ring-0 text-white placeholder:text-zinc-600 text-sm h-10 flex-1"
            />
            <button 
              type="submit" 
              className="h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}'''
    elif domain == "ecommerce":
        return '''// =============================================================================
// Next.js REACT COMPONENT - PREMIUM LUXURY STOREFRONT
// =============================================================================
"use client";

import React, { useState } from 'react';
import { ShoppingBag, Star, RefreshCw, X, ShoppingCart, Sparkles } from 'lucide-react';

export default function LuxuryStorefront() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products = [
    { id: "p-1", name: "Signature Drop Oversized Hoodie", desc: "Heavyweight loopback pre-shrunk organic cotton drop-shoulder hoodie.", price: "$120.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
    { id: "p-2", name: "Tailored Double-Breasted Trench", desc: "Sleek, water-resistant luxury utility silhouette trenchcoat.", price: "$280.00", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea" },
    { id: "p-3", name: "Raw Selvedge Denim Jacket", desc: "Japanese selvedge indigo dyed premium construction chore coat.", price: "$195.00", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0" }
  ];

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-blue-500/20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              Boutique Storefront: {name}
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">Premium Luxury Shopping Experience</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all relative"
          >
            <ShoppingCart className="w-4 h-4 text-zinc-300" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border border-white/5 rounded-3xl bg-zinc-900/30 overflow-hidden flex flex-col group hover:border-white/10 transition-colors shadow-lg">
              <div className="h-64 bg-zinc-900 relative overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <button 
                  onClick={() => addToCart(p)}
                  className="absolute bottom-4 right-4 h-10 px-4 rounded-xl bg-white text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Quick Add
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{p.name}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                  <span className="text-xs font-bold text-zinc-400">Retail price</span>
                  <span className="text-sm font-mono font-bold text-white">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-96 bg-zinc-950 border-l border-white/10 p-6 flex flex-col justify-between animate-slide-in">
              <div className="space-y-6 overflow-y-auto flex-1">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Checkout Bag
                  </h3>
                  <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-xs text-zinc-600 py-20 text-center font-mono">Your shopping cart is currently empty.</p>
                ) : (
                  <div className="space-y-3.5">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-3 justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[160px]">{item.name}</div>
                          <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.qty} × {item.price}</div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[9px] uppercase tracking-wider font-bold text-red-400 hover:bg-white/5 px-2 py-1 rounded">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl transition-all">Single-Click checkout</button>
                  <p className="text-[9px] text-zinc-600 text-center">Secure transactions powered by Stripe Links.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}'''
    elif domain == "crm":
        return '''// =============================================================================
// Next.js REACT COMPONENT - PREMIUM KANBAN WORKSPACE
// =============================================================================
"use client";

import React, { useState } from 'react';
import { Layers, Plus, Calendar, AlertCircle, Award, CheckSquare, Sparkles } from 'lucide-react';

export default function KanbanDashboard() {
  const [issues, setIssues] = useState([
    { id: "ISS-1", title: "Integrate OAuth2 SSO login", lane: "In_Progress", priority: "High", assignee: "Sophia Lee" },
    { id: "ISS-2", title: "Optimize SQL relational queries", lane: "Todo", priority: "Medium", assignee: "Marcus Chen" },
    { id: "ISS-3", title: "Refactor React state hydration", lane: "Backlog", priority: "Low", assignee: "Liam Murphy" }
  ]);
  const [newTitle, setNewTitle] = useState("");

  const lanes = [
    { id: "Backlog", label: "Backlog" },
    { id: "Todo", label: "To do" },
    { id: "In_Progress", label: "In progress" },
    { id: "Done", label: "Completed" }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIssues(prev => [...prev, {
      id: `ISS-${prev.length + 1}`,
      title: newTitle,
      lane: "Todo",
      priority: "Medium",
      assignee: "Self Assigned"
    }]);
    setNewTitle("");
  };

  const moveLane = (id: string, newLane: string) => {
    setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, lane: newLane } : issue));
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-blue-500/20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Workspace Board: {name}
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">High Performance Backlog planner</p>
          </div>
          <form onSubmit={handleCreate} className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <input 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Fast create ticket..." 
              className="border-none bg-transparent focus:ring-0 text-xs px-3 text-white placeholder:text-zinc-600 h-8"
            />
            <button type="submit" className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </header>

        {/* Board Lanes */}
        <div className="grid grid-cols-4 gap-4">
          {lanes.map((lane) => {
            const laneIssues = issues.filter(issue => issue.lane === lane.id);
            return (
              <div key={lane.id} className="p-4 rounded-2xl bg-zinc-900/20 border border-white/5 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{lane.label}</span>
                  <span className="text-[10px] font-mono text-zinc-700 bg-white/5 px-2 py-0.5 rounded-full">{laneIssues.length}</span>
                </div>
                
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {laneIssues.map((issue) => (
                    <div key={issue.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between min-h-[100px] shadow-sm relative group cursor-pointer">
                      <div>
                        <span className="text-[9px] font-mono text-blue-400 font-bold">{issue.id}</span>
                        <h4 className="text-xs font-semibold text-zinc-200 mt-1 leading-normal">{issue.title}</h4>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-zinc-500 font-mono">{issue.assignee}</span>
                        <div className="flex gap-1">
                          {lane.id !== "Done" && (
                            <button 
                              onClick={() => moveLane(issue.id, "Done")}
                              className="text-[8px] uppercase tracking-wider font-bold text-green-500 hover:bg-green-500/10 px-1.5 py-0.5 rounded border border-transparent hover:border-green-500/20"
                            >
                              Done
                            </button>
                          )}
                          {lane.id === "Todo" && (
                            <button 
                              onClick={() => moveLane(issue.id, "In_Progress")}
                              className="text-[8px] uppercase tracking-wider font-bold text-blue-400 hover:bg-blue-400/10 px-1.5 py-0.5 rounded border border-transparent hover:border-blue-400/20"
                            >
                              Start
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}'''
    else:
        return '''// =============================================================================
// Next.js REACT COMPONENT - SYSTEM METRIC WORKSPACE
// =============================================================================
"use client";

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, HardDrive, Cpu, Terminal, ArrowUpRight } from 'lucide-react';

export default function GenericDashboard() {
  const [load, setLoad] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(20, Math.min(85, prev + delta));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-blue-500/20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
              DevPilot: {name}
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">Telemetry Infrastructure Monitoring</p>
          </div>
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-bold uppercase tracking-widest font-mono">
            System Operational
          </span>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">CPU Burden</span>
              <h2 className="text-2xl font-mono font-bold text-white mt-1">{load}%</h2>
            </div>
            <Cpu className="w-8 h-8 text-blue-500 opacity-60" />
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Database Health</span>
              <h2 className="text-2xl font-mono font-bold text-green-500 mt-1">100%</h2>
            </div>
            <ShieldCheck className="w-8 h-8 text-green-500 opacity-60" />
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Memory Load</span>
              <h2 className="text-2xl font-mono font-bold text-white mt-1">4.2 GB</h2>
            </div>
            <HardDrive className="w-8 h-8 text-purple-500 opacity-60" />
          </div>
        </div>

        {/* Dynamic Telemetry Console Preview */}
        <div className="p-6 border border-white/5 rounded-3xl bg-zinc-900/30 flex flex-col justify-between min-h-[220px] shadow-lg relative">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
            <Terminal className="w-4 h-4 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">System Event Stream</span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px] text-zinc-500 flex-1">
            <div>[15:42:01] Ingested raw SaaS concept prompt...</div>
            <div>[15:42:02] Initialized langgraph multi-agent coordination swarm...</div>
            <div>[15:42:04] Systems Architect mapping decoupling bounds...</div>
            <div className="text-blue-400 font-bold">[15:42:05] Scaffold packaging finished successfully. Ready for build.</div>
          </div>
        </div>
      </div>
    </div>
  );
}'''

def get_qa_template(domain: str, name: str) -> str:
    return f"""# SYSTEM QA TEST PLAYBOOK & VALIDATION CHECKLIST

## Project: {name}
**Prepared by**: DevPilot QA Validation Agent
**Status**: VERIFIED

---

### 1. Test Automation Suite Configuration
The system leverages **pytest** for Python backend automation and **Playwright** for high-fidelity frontend E2E interactions.

### 2. Backend Automated Test Script (`tests/test_api.py`)
```python
import pytest
from fastapi.testclient import TestClient
import json

@pytest.fixture
def client():
    # Ingest main app configuration
    from backend.main import app
    return TestClient(app)

def test_system_operational_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_data_ingest_payload(client):
    # Tests standard transactional sync structures
    payload = {{"idea": "Gym pose tracker"}}
    response = client.post("/api/plan", json=payload)
    assert response.status_code == 200
    assert "accepted" in response.json()["status"]
```

### 3. Frontend End-to-End Test Playbook (`tests/e2e/workspace.spec.ts`)
```typescript
import {{ test, expect }} from '@playwright/test';

test.describe('DevPilot Workspace Ingestion', () => {{
  test('should successfully trigger multi-agent planning sequence', async ({{ page }}) => {{
    await page.goto('/');
    
    // Check initial layout stability
    await expect(page.locator('h1')).toContainText('DevPilot');
    
    // Ingest startup prompt idea
    const input = page.locator('input[placeholder*="Describe your SaaS"]');
    await input.fill('{name}');
    await page.click('button:has-text("Orchestrate")');
    
    // Verify websocket activation and log streams
    const telemetry = page.locator('aside:has-text("Execution Trace")');
    await expect(telemetry).toBeVisible();
  }});
}});
```

### 4. Human QA Verification Protocol
1. **WebSocket Handshake Validation**: Inspect Chrome networking panel; verify that WebSocket connections establish cleanly with `101 Switching Protocols` response codes.
2. **ZIP Bundle Integration**: Perform local zip extraction on downloaded assets; verify that directory boundaries remain compliant (e.g. `docs/`, `backend/`, `frontend/`).
3. **Database Constraints Testing**: Confirm SQL schemas construct cleanly inside empty PostgreSQL database instances without key resolution failures.
"""

def get_reviewer_template(domain: str, name: str) -> str:
    return f"""# EXPERT DESIGN & ARCHITECTURAL REVIEW CRITIQUE

## Evaluation Target: {name}
**Assessing Peer**: DevPilot Reviewer Agent
**Critique Verdict**: COMPLIANT (Grade A-)
**Date**: May 2026

---

### 1. System Evaluation & Overview
The planning blueprint for **{name}** represents a highly decoupled, modern, and production-ready architecture. The separation of Next.js and FastAPI creates a clear boundary between operational client layouts and transactional backend streams. The database relational normalized plan handles all functional requirements cleanly.

### 2. High-Priority Architecture Critiques

#### A. WebSocket Pipeline Throughput
> [!WARNING]
> While the full-duplex WebSocket route handles real-time streams, intensive payloads (e.g. video pose landmarks or simultaneous workspace collaborative cursor pulls) could cause API thread blocks.
> **Mitigation**: Implement an event-driven buffer via Redis or utilize Python's async task loop (`asyncio.gather`) to offload heavy calculations.

#### B. SQL Database Normalization
> [!TIP]
> The schema tables have been highly normalized, but heavy joins on tables like `order_items` or `issues` may degrade API query speed under heavy usage.
> **Mitigation**: Introduce composite composite indexes on key lookup parameters (e.g. `idx_orders_user` or `idx_issues_assignee`) as recommended in the DB blueprint.

#### C. Docker Deployment Boundary
> [!NOTE]
> The scaffold Docker configuration separates nodes elegantly. Ensure that volume bindings for local SQLite files or configuration logs are correctly configured in production.

### 3. Review Approval & Sign-Off
We have thoroughly evaluated the PRD features, system topologies, relational schemas, mock codes, and QA playbook.
The codebase layout matches modern, premium SaaS standards. The planning phase is successfully **COMPLETED** and approved for launch!
"""
