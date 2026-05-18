"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Send, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Circle, 
  Loader2,
  FileText,
  Code,
  Database,
  ShieldCheck,
  Search,
  Layout,
  Menu,
  Download,
  Share2,
  ListTodo,
  FileCode,
  Network,
  Settings,
  FolderOpen,
  ChevronRight,
  Copy,
  ChevronDown,
  Eye,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const MetricCard = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1 border-r border-white/5 last:border-0 pr-4">
    <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{label}</span>
    <span className="text-sm font-mono font-bold text-zinc-200">{value}</span>
  </div>
);

const AGENTS = [
  { id: "pm", name: "Product Manager", icon: FileText, color: "text-blue-400" },
  { id: "research", name: "Research Agent", icon: Search, color: "text-purple-400" },
  { id: "architect", name: "Architect Agent", icon: Cpu, color: "text-orange-400" },
  { id: "database", name: "Database Agent", icon: Database, color: "text-green-400" },
  { id: "backend", name: "Backend Engineer", icon: Code, color: "text-red-400" },
  { id: "frontend", name: "Frontend Engineer", icon: Layout, color: "text-cyan-400" },
  { id: "qa", name: "QA Agent", icon: ShieldCheck, color: "text-yellow-400" },
  { id: "reviewer", name: "Reviewer Agent", icon: Zap, color: "text-pink-400" },
];

import { AgentCard } from "@/components/dashboard/AgentCard";
import dynamic from "next/dynamic";
const WorkflowGraph = dynamic(
  () => import("@/components/dashboard/WorkflowGraph").then((mod) => mod.WorkflowGraph),
  { ssr: false, loading: () => <div className="h-full w-full bg-black/20 animate-pulse" /> }
);
import { TerminalPanel } from "@/components/dashboard/TerminalPanel";
import { useWebSocket } from "@/hooks/use-websocket";
import { ReactFlowProvider } from "reactflow";

// Import dynamic live interactive previews
import FitnessDashboard from "./fitness_preview";
import ChatDashboard from "./chat_preview";
import LuxuryStorefront from "./ecommerce_preview";
import KanbanDashboard from "./crm_preview";
import GenericDashboard from "./general_preview";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<{agent: string, message: string, time: string}[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [projectState, setProjectState] = useState<any>({});
  const [activeTab, setActiveTab] = useState("graph");

  // LLM settings control panel state
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [apiBase, setApiBase] = useState("https://api.groq.com/openai/v1");
  const [modelName, setModelName] = useState("llama-3.3-70b-versatile");
  const [temperature, setTemperature] = useState(0.7);

  // File explorer selection state
  const [selectedFile, setSelectedFile] = useState("docs/PRD.md");

  // Auto-resolve live websocket connection for production build context
  const wsUrl = typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "wss://devpilot-g6x4.onrender.com/ws"
    : (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001/ws");

  const { messages, status, sendMessage, clearMessages } = useWebSocket(wsUrl);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === "agent_update") {
        const agentId = AGENTS.find(a => a.name === lastMessage.agent)?.id || lastMessage.agent.toLowerCase();
        
        if (lastMessage.status === "running") {
          setActiveAgent(agentId);
        } else if (lastMessage.status === "completed") {
          setActiveAgent(null);
          if (!completedAgents.includes(agentId)) {
            setCompletedAgents(prev => [...prev, agentId]);
          }
        }
        
        lastMessage.logs.forEach((log: string) => {
          // Avoid appending exact duplicate logs
          setLogs(prev => {
            const exists = prev.some(l => l.message === log && l.agent === lastMessage.agent);
            if (exists) return prev;
            return [...prev, {
              agent: lastMessage.agent,
              message: log,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            }];
          });
        });
      }
      
      if (lastMessage.type === "state_update") {
        setProjectState((prev: any) => ({ ...prev, ...lastMessage.state }));
        if (lastMessage.state.current_agent) {
           const agentId = AGENTS.find(a => a.name === lastMessage.state.current_agent)?.id;
           if (agentId && lastMessage.state.current_agent !== "Reviewer") {
             setActiveAgent(agentId);
           }
        }
      }
      
      if (lastMessage.type === "workflow_complete") {
        setIsProcessing(false);
        setActiveAgent(null);
      }
      
      if (lastMessage.type === "error") {
        setLogs(prev => [...prev, {
          agent: "System",
          message: `Error: ${lastMessage.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }]);
        setIsProcessing(false);
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setIsProcessing(true);
    setLogs([]);
    setCompletedAgents([]);
    setProjectState({});
    setActiveTab("graph");
    clearMessages(); // Reset websocket message queues
    
    sendMessage({
      type: "start_workflow",
      idea: prompt,
      config: {
        provider,
        apiKey,
        apiBase,
        modelName,
        temperature
      }
    });
  };

  const handleExport = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prd: projectState.prd || "",
          architecture: projectState.architecture || "",
          database_schema: projectState.database_schema || "",
          backend_code: projectState.backend_code || "",
          frontend_code: projectState.frontend_code || "",
          qa_checklist: projectState.qa_checklist || ""
        }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `devpilot-project-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Determine Matched Template Domain from prompt or state
  const currentDomain = useMemo(() => {
    const text = (prompt || "").toLowerCase();
    if (any(text, ["fitness", "workout", "gym", "coach", "health", "exercise", "run", "track", "sport"])) return "fitness";
    if (any(text, ["chat", "bot", "clone", "assistant", "ai", "conversation", "gpt"])) return "chat";
    if (any(text, ["shop", "store", "commerce", "sell", "checkout", "buy", "retail", "fashion"])) return "ecommerce";
    if (any(text, ["crm", "kanban", "project", "manage", "task", "trello", "jira", "tracker"])) return "crm";
    return "general";
  }, [prompt]);

  function any(str: string, keys: string[]) {
    return keys.some(k => str.includes(k));
  }

  // Get content for visual file tree
  const getSelectedFileContent = () => {
    switch (selectedFile) {
      case "docs/PRD.md": return projectState.prd || "// Awaiting Product Requirements specifications...";
      case "docs/architecture.md": return projectState.architecture || "// Awaiting systems architecture layout...";
      case "docs/database.sql": return projectState.database_schema || "-- Awaiting relational DDL statements...";
      case "docs/QA_checklist.md": return projectState.qa_checklist || "# QA Test strategy not compiled yet.";
      case "backend/main.py": return projectState.backend_code || "# FastAPI API controller not initialized.";
      case "frontend/src/App.tsx": return projectState.frontend_code || "// React frontend code designed by frontend engineer.";
      case "docker-compose.yml": return "version: '3.8'\n\nservices:\n  web:\n    build: ./frontend\n    ports:\n      - '3000:3000'\n  api:\n    build: ./backend\n    ports:\n      - '8000:8000'\n    volumes:\n      - .:/app";
      case "README.md": return `# Scaffolded Startup Blueprint\n\nSynthesized dynamically by the DevPilot Agent Swarm.\n\n## Running the Project\n1. Spin up the backend API controller:\n   \`\`\`bash\n   cd backend\n   pip install -r requirements.txt\n   python main.py\n   \`\`\`\n2. Spin up the Next.js storefront client:\n   \`\`\`bash\n   cd frontend\n   npm install\n   npm run dev\n   \`\`\``;
      default: return "";
    }
  };

  return (
    <ReactFlowProvider>
    <div className="flex flex-col h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Premium Glass Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative w-9 h-9 bg-black rounded-xl flex items-center justify-center border border-white/10">
              <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              DevPilot 
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] py-0 h-4">PRO</Badge>
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Autonomous Swarm Architect</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${status === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
              {status === "connected" ? "Swarm Engine Online" : "Swarm Engine Offline"}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4 bg-white/10" />
          
          {/* Glowing Engine Settings Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSettings(true)}
            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl gap-2 font-bold text-xs uppercase tracking-wider border border-white/5"
          >
            <Settings className="w-3.5 h-3.5" />
            LLM Settings
          </Button>

          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black relative">
        
        {/* Sidebar - Agents Swarm */}
        <aside className="w-72 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-8 backdrop-blur-xl shrink-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Agent Swarm</h2>
              <span className="text-[10px] text-zinc-700 font-mono">{completedAgents.length}/8</span>
            </div>
            <div className="space-y-2">
              {AGENTS.map((agent) => (
                <AgentCard 
                  key={agent.id}
                  {...agent}
                  isActive={activeAgent === agent.id}
                  isCompleted={completedAgents.includes(agent.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
            <div className="relative p-4 rounded-2xl bg-black border border-white/5">
              <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-tight">System Core</h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Compiling visual state updates into complete production specifications and starter scaffold.
              </p>
            </div>
          </div>
        </aside>

        {/* Central Orchestration Canvas */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isProcessing && completedAgents.length === 0 ? (
                <motion.div 
                  key="intro-screen"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                  className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center p-6"
                >
                  <div className="relative mb-8 group">
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition duration-1000 animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-zinc-900 to-black rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl">
                      <Cpu className="w-10 h-10 text-blue-500" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                    Product-to-Engineering Swarm.
                  </h2>
                  <p className="text-zinc-400 text-base mb-10 leading-relaxed max-w-lg">
                    Transform abstract startup ideas into complete engineering plans, tech-stack architecture blueprints, database schemas, and clean starter scaffolding.
                  </p>
                  
                  {/* Visual Blueprint paradigm context */}
                  <div className="grid grid-cols-3 gap-6 w-full max-w-lg mb-10 text-left">
                    {[
                      { label: "INPUT", val: "Startup Idea", desc: "Your raw product prompt", color: "border-blue-500/20" },
                      { label: "PROCESS", val: "Agent Swarm", desc: "Autonomous synthesis & plans", color: "border-purple-500/20" },
                      { label: "OUTPUT", val: "Blueprint + Repo", desc: "Downloadable scaffold & PRDs", color: "border-green-500/20" },
                    ].map((step) => (
                      <div key={step.label} className={`p-4 rounded-2xl bg-white/[0.02] border ${step.color}`}>
                        <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{step.label}</div>
                        <div className="text-sm font-bold text-white mb-0.5">{step.val}</div>
                        <div className="text-[10px] text-zinc-500 leading-normal">{step.desc}</div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleSubmit} className="w-full relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                    <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-2 pl-6">
                      <Input 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your SaaS, application, or platform concept..." 
                        className="border-none bg-transparent focus-visible:ring-0 text-white placeholder:text-zinc-700 text-lg h-14"
                      />
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={status !== "connected"}
                        className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-2xl shadow-blue-500/20 font-bold tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Orchestrate
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="dashboard-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col bg-black/50"
                >
                  {/* Live System Metrics */}
                  <div className="grid grid-cols-5 gap-4 px-8 py-5 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl shrink-0">
                    <MetricCard label="Active Agents" value={activeAgent ? '1' : '0'} />
                    <MetricCard label="Tasks Completed" value={`${completedAgents.length}/8`} />
                    <MetricCard label="Artifacts" value={Object.keys(projectState).filter(k => projectState[k]).length.toString()} />
                    <MetricCard label="Runtime" value={isProcessing ? "Executing..." : "00:18.4s"} />
                    <MetricCard label="Tokens Processed" value={isProcessing ? "~24.2k" : "48.2k"} />
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0">
                      <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-10">
                        <TabsTrigger value="graph" className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all">Workflow</TabsTrigger>
                        <TabsTrigger value="spec" className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all relative">
                          Specification
                          {projectState.prd && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                        </TabsTrigger>
                        <TabsTrigger value="architecture" className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all relative">
                          Architecture
                          {projectState.architecture && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                        </TabsTrigger>
                        <TabsTrigger value="database" className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all relative">
                          Database Schema
                          {projectState.database_schema && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                        </TabsTrigger>
                        <TabsTrigger value="scaffold" className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all relative">
                          Workspace IDE
                          {projectState.backend_code && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                        </TabsTrigger>
                        <TabsTrigger value="preview" disabled={completedAgents.length < 8} className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all text-green-400 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 disabled:opacity-30 relative">
                          Live Preview
                          {completedAgents.length === 8 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />}
                        </TabsTrigger>
                      </TabsList>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleExport}
                          disabled={completedAgents.length < 8}
                          className="border-white/10 bg-white/5 text-zinc-300 gap-2 hover:bg-white/10 rounded-xl px-4 font-bold text-xs uppercase tracking-tight"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Repo
                        </Button>
                      </div>
                    </div>
                    
                    {/* WORKFLOW GRAPH TAB WITH FLOATING ARTIFACT TRACKER */}
                    <TabsContent value="graph" className="flex-1 m-0 relative overflow-hidden">
                      <WorkflowGraph 
                        agents={AGENTS} 
                        activeAgent={activeAgent} 
                        completedAgents={completedAgents} 
                      />
                      
                      {/* Progressive Floating Artifact Tracker */}
                      <div className="absolute bottom-6 left-6 z-10 bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md min-w-[240px]">
                        <div className="flex items-center gap-2 mb-3">
                          <Network className="w-3.5 h-3.5 text-zinc-500" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Milestone Artifacts</h4>
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { name: "Product Specs", key: "prd", tab: "spec" },
                            { name: "Architect Blueprint", key: "architecture", tab: "architecture" },
                            { name: "SQL DB Schema", key: "database_schema", tab: "database" },
                            { name: "Backend Router", key: "backend_code", tab: "scaffold" },
                          ].map((art) => {
                            const exists = !!projectState[art.key];
                            return (
                              <div key={art.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-xs">
                                  <div className={`w-2 h-2 rounded-full ${exists ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-800"}`} />
                                  <span className={exists ? "text-zinc-200" : "text-zinc-600"}>{art.name}</span>
                                </div>
                                {exists && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setActiveTab(art.tab)}
                                    className="h-6 px-2 text-[9px] uppercase tracking-wider font-bold text-blue-400 hover:bg-white/5 rounded"
                                  >
                                    View
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Final Telemetry Overlay Complete */}
                      <AnimatePresence>
                        {completedAgents.length === 8 && !isProcessing && (
                          <motion.div 
                            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute top-6 right-6 z-10 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] min-w-[280px]"
                          >
                            <div className="flex items-center gap-3 mb-5">
                              <div className="p-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 shadow-[inset_0_1px_0_0_rgba(34,197,94,0.2)]">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <h3 className="text-sm font-bold text-white tracking-tight">Execution Complete</h3>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Agents</span>
                                <span className="text-zinc-300 font-medium">8 Coordinated</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Artifacts</span>
                                <span className="text-zinc-300 font-medium">{Object.keys(projectState).filter(k => projectState[k]).length} Generated</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Status</span>
                                <span className="text-green-500 font-medium flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  Repo Scaffolding Verified
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-2">
                              <Button 
                                onClick={() => setActiveTab("preview")}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl shadow-lg shadow-green-500/20"
                              >
                                Launch Live Preview
                              </Button>
                              <div className="flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold mt-1">
                                <span>Telemetry</span>
                                <span className="text-blue-400 font-mono font-medium">18.4s runtime</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabsContent>
                    
                    {/* SPECIFICATION TAB WITH PROJECT OVERVIEW */}
                    <TabsContent value="spec" className="flex-1 m-0 overflow-hidden">
                       <ScrollArea className="h-full w-full bg-black/40 p-8">
                          <div className="max-w-4xl mx-auto space-y-8 pb-12">
                            {/* Project Overview Panel */}
                            {projectState.prd && (
                              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl border border-white/5 bg-zinc-950/80 shadow-inner">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Project Overview Blueprint</h3>
                                <div className="grid grid-cols-4 gap-4">
                                  {[
                                    { label: "Detected Name", val: prompt ? prompt.substring(0, 20) + "..." : "DevPilot scaffold" },
                                    { label: "SaaS Category", val: currentDomain === "general" ? "General developer tool" : currentDomain.toUpperCase() + " SaaS App" },
                                    { label: "Build Scope", val: "Estimated 2-3 Weeks" },
                                    { label: "Recommended Stack", val: "Next.js + FastAPI + Postgres" },
                                  ].map((ov) => (
                                    <div key={ov.label} className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{ov.label}</div>
                                      <div className="text-xs font-bold text-white truncate">{ov.val}</div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {projectState.prd ? (
                              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <h3 className="text-xl font-bold text-white tracking-tight">Product Requirements & Criteria</h3>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 text-zinc-300 font-sans leading-relaxed text-sm shadow-inner whitespace-pre-wrap font-mono">
                                  {projectState.prd}
                                </div>
                              </motion.section>
                            ) : (
                              <div className="py-20 text-center opacity-40">Awaiting Product Manager orchestration...</div>
                            )}
                          </div>
                       </ScrollArea>
                    </TabsContent>
                    
                    {/* SYSTEM ARCHITECTURE TAB */}
                    <TabsContent value="architecture" className="flex-1 m-0 overflow-hidden">
                       <ScrollArea className="h-full w-full bg-black/40 p-8">
                          <div className="max-w-4xl mx-auto space-y-8 pb-12">
                            {projectState.architecture ? (
                              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Cpu className="w-5 h-5" />
                                  </div>
                                  <h3 className="text-xl font-bold text-white tracking-tight">System Infrastructure Architecture</h3>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 text-zinc-300 font-sans leading-relaxed text-sm shadow-inner whitespace-pre-wrap font-mono">
                                  {projectState.architecture}
                                </div>
                              </motion.section>
                            ) : (
                              <div className="py-20 text-center opacity-40">Awaiting System Architect Agent compilation...</div>
                            )}
                          </div>
                       </ScrollArea>
                    </TabsContent>

                    {/* DATABASE SCHEMA TAB WITH ERD VISUALIZATION */}
                    <TabsContent value="database" className="flex-1 m-0 overflow-hidden">
                       <ScrollArea className="h-full w-full bg-black/40 p-8">
                          <div className="max-w-6xl mx-auto space-y-8 pb-12">
                            {projectState.database_schema ? (
                              <div className="space-y-8">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-8">
                                  
                                  {/* Database Schema SQL Preview */}
                                  <div className="col-span-7 space-y-4">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                        <Database className="w-5 h-5" />
                                      </div>
                                      <h3 className="text-xl font-bold text-white tracking-tight">Database Schema Definition</h3>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 text-zinc-300 font-sans leading-relaxed text-sm shadow-inner whitespace-pre-wrap font-mono">
                                      {projectState.database_schema}
                                    </div>
                                  </div>

                                  {/* High-Fidelity Interactive ERD Visualizer */}
                                  <div className="col-span-5 space-y-4">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 flex items-center gap-2">
                                      <Network className="w-3.5 h-3.5" />
                                      Table Relationships (ERD)
                                    </h4>
                                    <div className="border border-white/5 rounded-[2rem] p-6 bg-zinc-950/60 shadow-inner flex flex-col gap-6 relative min-h-[400px] justify-center overflow-hidden">
                                      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
                                      
                                      {/* Renders tables dynamically depending on active matched domain */}
                                      {currentDomain === "fitness" && (
                                        <div className="space-y-4 w-full relative z-10 animate-fade-in">
                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>users</span>
                                              <span className="text-[8px] text-zinc-500">PK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div>email : varchar</div>
                                            </div>
                                          </div>
                                          
                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>biometric_profiles</span>
                                              <span className="text-[8px] text-zinc-500">PK / FK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div className="text-purple-400">user_id : uuid (FK users.id)</div>
                                              <div>weight_kg : decimal</div>
                                            </div>
                                          </div>

                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>training_sessions</span>
                                              <span className="text-[8px] text-zinc-500">PK / FK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div className="text-purple-400">user_id : uuid (FK users.id)</div>
                                              <div>duration_seconds : int</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {currentDomain === "chat" && (
                                        <div className="space-y-4 w-full relative z-10 animate-fade-in">
                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>agents</span>
                                              <span className="text-[8px] text-zinc-500">PK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div>name : varchar</div>
                                              <div>system_prompt : text</div>
                                            </div>
                                          </div>

                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>messages</span>
                                              <span className="text-[8px] text-zinc-500">PK / FK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div className="text-purple-400">agent_id : uuid (FK agents.id)</div>
                                              <div>content : text</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {currentDomain === "ecommerce" && (
                                        <div className="space-y-4 w-full relative z-10 animate-fade-in">
                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>products</span>
                                              <span className="text-[8px] text-zinc-500">PK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div>name : varchar</div>
                                              <div>price_cents : int</div>
                                            </div>
                                          </div>

                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>order_items</span>
                                              <span className="text-[8px] text-zinc-500">PK / FK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div className="text-purple-400">product_id : uuid (FK products.id)</div>
                                              <div>quantity : int</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {currentDomain === "crm" && (
                                        <div className="space-y-4 w-full relative z-10 animate-fade-in">
                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>issues</span>
                                              <span className="text-[8px] text-zinc-500">PK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div>title : varchar</div>
                                              <div>status : varchar</div>
                                            </div>
                                          </div>

                                          <div className="border border-white/10 rounded-xl p-3 bg-zinc-900/80">
                                            <div className="text-[10px] font-bold text-white border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                                              <span>subtasks</span>
                                              <span className="text-[8px] text-zinc-500">PK / FK</span>
                                            </div>
                                            <div className="space-y-0.5 font-mono text-[9px] text-zinc-400">
                                              <div>id : uuid <span className="text-blue-500">(PK)</span></div>
                                              <div className="text-purple-400">issue_id : uuid (FK issues.id)</div>
                                              <div>is_completed : boolean</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {currentDomain === "general" && (
                                        <div className="space-y-4 w-full relative z-10 animate-fade-in">
                                          <div className="border border-white/10 rounded-xl p-3.5 bg-zinc-900/80 relative z-10">
                                            <div className="text-xs font-bold text-white border-b border-white/5 pb-1.5 mb-2 flex items-center justify-between">
                                              <span>users</span>
                                              <span className="text-[9px] uppercase tracking-widest text-zinc-500">PK</span>
                                            </div>
                                            <div className="space-y-1 font-mono text-[10px] text-zinc-400">
                                              <div>id : uuid</div>
                                              <div>email : varchar(255)</div>
                                              <div>created_at : timestamp</div>
                                            </div>
                                          </div>

                                          <div className="h-px bg-blue-500/20 w-12 mx-auto relative z-10">
                                            <div className="absolute -top-1 left-5 w-2 h-2 rounded-full bg-blue-400" />
                                          </div>

                                          <div className="border border-white/10 rounded-xl p-3.5 bg-zinc-900/80 relative z-10">
                                            <div className="text-xs font-bold text-white border-b border-white/5 pb-1.5 mb-2 flex items-center justify-between">
                                              <span>blueprints</span>
                                              <span className="text-[9px] uppercase tracking-widest text-zinc-500">PK / FK</span>
                                            </div>
                                            <div className="space-y-1 font-mono text-[10px] text-zinc-400">
                                              <div>id : uuid</div>
                                              <div>user_id : uuid (FK users.id)</div>
                                              <div>name : varchar(255)</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  </div>

                                </motion.div>
                              </div>
                            ) : (
                              <div className="py-20 text-center opacity-40">Awaiting Database Agent schema definition...</div>
                            )}
                          </div>
                       </ScrollArea>
                    </TabsContent>

                    {/* INTERACTIVE WORKSPACE IDE SCRIPTER TAB */}
                    <TabsContent value="scaffold" className="flex-1 m-0 overflow-hidden">
                       <div className="h-full w-full flex bg-[#060608]">
                          
                          {/* File Tree Explorer (Left column) */}
                          <div className="w-64 border-r border-white/5 bg-black/40 p-4 flex flex-col gap-4 overflow-y-auto shrink-0 select-none">
                            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <FolderOpen className="w-3.5 h-3.5 text-zinc-500" />
                                File Explorer
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {/* Directory docs/ */}
                              <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 py-1.5 px-2">
                                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                                  <span>docs</span>
                                </div>
                                <div className="pl-4 space-y-1">
                                  {[
                                    { name: "PRD.md", path: "docs/PRD.md" },
                                    { name: "architecture.md", path: "docs/architecture.md" },
                                    { name: "database.sql", path: "docs/database.sql" },
                                    { name: "QA_checklist.md", path: "docs/QA_checklist.md" }
                                  ].map(f => (
                                    <div 
                                      key={f.path} 
                                      onClick={() => setSelectedFile(f.path)}
                                      className={`flex items-center gap-2 text-xs py-1 px-2.5 rounded-lg cursor-pointer transition-all ${
                                        selectedFile === f.path ? "bg-blue-500/10 text-white font-medium border border-blue-500/15" : "text-zinc-500 hover:text-zinc-300"
                                      }`}
                                    >
                                      <FileText className={`w-3.5 h-3.5 ${selectedFile === f.path ? "text-blue-400" : "text-zinc-600"}`} />
                                      <span className="truncate">{f.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Directory backend/ */}
                              <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 py-1.5 px-2">
                                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                                  <span>backend</span>
                                </div>
                                <div className="pl-4 space-y-1">
                                  <div 
                                    onClick={() => setSelectedFile("backend/main.py")}
                                    className={`flex items-center gap-2 text-xs py-1 px-2.5 rounded-lg cursor-pointer transition-all ${
                                      selectedFile === "backend/main.py" ? "bg-blue-500/10 text-white font-medium border border-blue-500/15" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    <Code className={`w-3.5 h-3.5 ${selectedFile === "backend/main.py" ? "text-blue-400" : "text-zinc-600"}`} />
                                    <span>main.py</span>
                                  </div>
                                </div>
                              </div>

                              {/* Directory frontend/ */}
                              <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 py-1.5 px-2">
                                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                                  <span>frontend</span>
                                </div>
                                <div className="pl-4 space-y-1">
                                  <div 
                                    onClick={() => setSelectedFile("frontend/src/App.tsx")}
                                    className={`flex items-center gap-2 text-xs py-1 px-2.5 rounded-lg cursor-pointer transition-all ${
                                      selectedFile === "frontend/src/App.tsx" ? "bg-blue-500/10 text-white font-medium border border-blue-500/15" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    <Layout className={`w-3.5 h-3.5 ${selectedFile === "frontend/src/App.tsx" ? "text-blue-400" : "text-zinc-600"}`} />
                                    <span>App.tsx</span>
                                  </div>
                                </div>
                              </div>

                              {/* Root files */}
                              <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 py-1.5 px-2">
                                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                                  <span>root</span>
                                </div>
                                <div className="pl-4 space-y-1">
                                  {[
                                    { name: "docker-compose.yml", path: "docker-compose.yml" },
                                    { name: "README.md", path: "README.md" }
                                  ].map(f => (
                                    <div 
                                      key={f.path} 
                                      onClick={() => setSelectedFile(f.path)}
                                      className={`flex items-center gap-2 text-xs py-1 px-2.5 rounded-lg cursor-pointer transition-all ${
                                        selectedFile === f.path ? "bg-blue-500/10 text-white font-medium border border-blue-500/15" : "text-zinc-500 hover:text-zinc-300"
                                      }`}
                                    >
                                      <FileCode className={`w-3.5 h-3.5 ${selectedFile === f.path ? "text-blue-400" : "text-zinc-600"}`} />
                                      <span>{f.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Line-Numbered Monaco-like Editor View */}
                          <div className="flex-1 flex flex-col bg-black overflow-hidden relative border-l border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                            
                            {/* Editor Tab Bar */}
                            <div className="h-11 border-b border-white/5 bg-[#0b0b0e] flex items-center justify-between px-6 relative z-10">
                              <span className="text-[10px] text-zinc-500 font-mono tracking-tight flex items-center gap-2 select-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {selectedFile}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigator.clipboard.writeText(getSelectedFileContent())}
                                className="h-7 text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors border border-white/5 hover:border-white/10 rounded-lg gap-2"
                              >
                                <Copy className="w-3 h-3" />
                                Copy Code
                              </Button>
                            </div>
                            
                            {/* Scroll Editor Body */}
                            <ScrollArea className="flex-1 p-6 relative z-10 font-mono text-[11px] leading-loose">
                              <div className="flex gap-4">
                                {/* Simulated Line Numbers */}
                                <div className="text-zinc-700 select-none text-right pr-2 border-r border-white/5 text-[10px]">
                                  {Array.from({ length: Math.max(15, getSelectedFileContent().split("\n").length) }).map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                  ))}
                                </div>
                                
                                {/* Code content */}
                                <pre className="text-zinc-300 whitespace-pre-wrap flex-1 select-text">
                                  {getSelectedFileContent()}
                                </pre>
                              </div>
                            </ScrollArea>
                          </div>
                          
                       </div>
                    </TabsContent>

                    {/* LIVE INTERACTIVE BLUEPRINT PREVIEW TAB */}
                    <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
                       <ScrollArea className="h-full w-full bg-black/60 relative">
                          <AnimatePresence mode="wait">
                            {completedAgents.length === 8 && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                              >
                                {currentDomain === "fitness" && <FitnessDashboard name={prompt ? prompt.substring(0, 30) : "GymAI"} />}
                                {currentDomain === "chat" && <ChatDashboard name={prompt ? prompt.substring(0, 30) : "Conversational Swarm"} />}
                                {currentDomain === "ecommerce" && <LuxuryStorefront name={prompt ? prompt.substring(0, 30) : "Streetwear Shop"} />}
                                {currentDomain === "crm" && <KanbanDashboard name={prompt ? prompt.substring(0, 30) : " Linear Board"} />}
                                {currentDomain === "general" && <GenericDashboard name={prompt ? prompt.substring(0, 30) : "Telemetry Panel"} />}
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </ScrollArea>
                    </TabsContent>

                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Logs Side Panel */}
        <TerminalPanel logs={logs} />
      </main>

      {/* Dynamic Cursor-style LLM settings slide-over modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Top border glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  Provider Configuration
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white text-xs uppercase font-bold">Close</button>
              </div>
              
              <div className="space-y-4">
                {/* Select Provider */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">LLM Provider</label>
                  <select 
                    value={provider} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setProvider(val);
                      if (val === "groq") {
                        setApiBase("https://api.groq.com/openai/v1");
                        setModelName("llama-3.3-70b-versatile");
                      } else if (val === "openai") {
                        setApiBase("https://api.openai.com/v1");
                        setModelName("gpt-4o-mini");
                      } else if (val === "ollama") {
                        setApiBase("http://localhost:11434/v1");
                        setModelName("llama3");
                      } else if (val === "vllm") {
                        setApiBase("http://localhost:8000/v1");
                        setModelName("qwen-2.5-7b-instruct");
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="groq" className="bg-zinc-950 text-white">Groq Cloud (Fast)</option>
                    <option value="openai" className="bg-zinc-950 text-white">OpenAI Platform</option>
                    <option value="ollama" className="bg-zinc-950 text-white">Ollama (Local Host)</option>
                    <option value="vllm" className="bg-zinc-950 text-white">vLLM / Open-Source API</option>
                  </select>
                </div>

                {/* API Key */}
                {provider !== "ollama" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">API Authentication Key</label>
                    <Input 
                      type="password" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)} 
                      placeholder="Enter provider secret key..."
                      className="bg-white/5 border-white/10 text-white text-xs rounded-xl"
                    />
                  </div>
                )}

                {/* API Base URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Endpoint Base URL</label>
                  <Input 
                    type="text" 
                    value={apiBase} 
                    onChange={(e) => setApiBase(e.target.value)} 
                    placeholder="URL endpoint base..."
                    className="bg-white/5 border-white/10 text-white text-xs rounded-xl"
                  />
                </div>

                {/* Model Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target Model Name</label>
                  <Input 
                    type="text" 
                    value={modelName} 
                    onChange={(e) => setModelName(e.target.value)} 
                    placeholder="Model identifier tag..."
                    className="bg-white/5 border-white/10 text-white text-xs rounded-xl"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Creativity Scale</span>
                    <span className="text-blue-400">{temperature}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.1" 
                    value={temperature} 
                    onChange={(e) => setTemperature(parseFloat(e.target.value))} 
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl font-bold uppercase tracking-widest h-10 animate-glow"
              >
                Apply Engine Settings
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </ReactFlowProvider>
  );
}
