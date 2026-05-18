"use client";

import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  BaseEdge,
  getBezierPath,
  EdgeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & GLOBALS
// ─────────────────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
  icon?: LucideIcon | React.ElementType;
  color?: string;
}

interface WorkflowGraphProps {
  activeAgent: string | null;
  completedAgents: string[];
  agents: Agent[];
}

type AgentStatus = 'WAITING' | 'THINKING' | 'STREAMING' | 'REVIEWING' | 'BLOCKED' | 'DONE';

interface AgentNodeData {
  icon?: LucideIcon | React.ElementType;
  status: AgentStatus;
  label: string;
  color?: string;
  dependencyText?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STABLE CUSTOM NODE WITH TELEMETRY
// ─────────────────────────────────────────────────────────────────────────────

const AgentNode = React.memo(({ data }: { data: AgentNodeData }) => {
  const { icon: Icon, status, label, color, dependencyText } = data;
  const [runtime, setRuntime] = useState(0);

  // Simulated runtime counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (['THINKING', 'STREAMING', 'REVIEWING'].includes(status)) {
      interval = setInterval(() => {
        setRuntime((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'WAITING') {
      setRuntime(0);
    }
  }, [status]);

  const statusStyles = {
    WAITING: 'border-white/10 bg-white/[0.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
    THINKING: 'border-blue-500/40 bg-blue-950/20 shadow-[inset_0_1px_8px_0_rgba(59,130,246,0.3)]',
    STREAMING: 'border-purple-500/40 bg-purple-950/20 shadow-[inset_0_1px_8px_0_rgba(168,85,247,0.3)]',
    REVIEWING: 'border-orange-500/40 bg-orange-950/20 shadow-[inset_0_1px_8px_0_rgba(249,115,22,0.3)]',
    BLOCKED: 'border-red-500/50 bg-red-950/20 shadow-[inset_0_1px_0_0_rgba(239,68,68,0.2)]',
    DONE: 'border-green-500/30 bg-green-950/10 shadow-[inset_0_1px_0_0_rgba(34,197,94,0.1)] opacity-90',
  };

  const statusTextColors = {
    WAITING: 'text-zinc-500',
    THINKING: 'text-blue-400',
    STREAMING: 'text-purple-400',
    REVIEWING: 'text-orange-400',
    BLOCKED: 'text-red-400',
    DONE: 'text-green-500',
  };

  const currentStyle = statusStyles[status] || statusStyles.WAITING;
  const currentTextColor = statusTextColors[status] || statusTextColors.WAITING;
  const isActive = ['THINKING', 'STREAMING', 'REVIEWING'].includes(status);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-3 rounded-xl border backdrop-blur-xl min-w-[200px] transition-all duration-700 relative overflow-hidden group ${currentStyle}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !w-2 !h-2 !border-none !rounded-sm opacity-50 group-hover:opacity-100 transition-opacity" />
      
      {/* Subtle top glare effect */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-center gap-3 relative z-10">
        <div className={`p-2 rounded-lg transition-colors duration-500 ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
          {Icon && <Icon className={`w-4 h-4 transition-colors duration-500 ${isActive || status === 'DONE' ? color : 'text-zinc-500'}`} />}
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-[13px] font-semibold text-zinc-200 tracking-tight">{label}</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className={`text-[9px] uppercase tracking-widest font-bold ${currentTextColor} ${isActive ? 'animate-pulse' : ''}`}>
              {status === 'WAITING' && dependencyText ? dependencyText : status}
            </span>
            {/* Runtime Telemetry */}
            {(isActive || status === 'DONE') && (
              <span className="text-[9px] font-mono text-zinc-500 font-medium">
                {runtime.toFixed(1)}s
              </span>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !w-2 !h-2 !border-none !rounded-sm opacity-50 group-hover:opacity-100 transition-opacity" />
      
      {/* Delicate active glow halo */}
      {isActive && (
        <motion.div
          className={`absolute -inset-[1px] rounded-xl blur-[2px] -z-20 ${
            status === 'THINKING' ? 'bg-blue-500/20' : status === 'STREAMING' ? 'bg-purple-500/20' : 'bg-orange-500/20'
          }`}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
});
AgentNode.displayName = 'AgentNode';

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM ANIMATED EDGE WITH GLOW
// ─────────────────────────────────────────────────────────────────────────────

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.isActive;
  const isCompleted = data?.isCompleted;
  
  // Cinematic colors
  const strokeColor = isCompleted ? 'rgba(34, 197, 94, 0.4)' : isActive ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.05)';

  return (
    <>
      {/* Defines a precise glow filter for the edge */}
      <defs>
        <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Base Edge */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: isCompleted ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.05)', 
          strokeWidth: 1,
          transition: 'stroke 1s ease-in-out'
        }} 
      />

      {/* Signal Flow Animation */}
      {isActive && (
        <BaseEdge 
          path={edgePath} 
          style={{
            ...style,
            stroke: strokeColor,
            strokeWidth: 1.5,
            filter: 'url(#edge-glow)',
            strokeDasharray: '4 8',
            animation: 'flowAnimation 1s linear infinite'
          }}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// THE IRONCLAD STABILITY SINGLETON
// ─────────────────────────────────────────────────────────────────────────────

const getStableConfig = () => {
  if (typeof window === 'undefined') return {
    nodeTypes: { agent: AgentNode },
    edgeTypes: { animated: AnimatedEdge },
    defaultEdgeOptions: { style: { strokeWidth: 1 } },
    fitViewOptions: { padding: 0.2 },
    proOptions: { hideAttribution: true },
    snapGrid: [20, 20] as [number, number]
  };

  if (!(window as any)._DEV_PILOT_STABLE_CONFIG_V3) {
    (window as any)._DEV_PILOT_STABLE_CONFIG_V3 = {
      nodeTypes: { agent: AgentNode },
      edgeTypes: { animated: AnimatedEdge },
      defaultEdgeOptions: { style: { strokeWidth: 1 } },
      fitViewOptions: { padding: 0.2 },
      proOptions: { hideAttribution: true },
      snapGrid: [20, 20] as [number, number]
    };
  }
  return (window as any)._DEV_PILOT_STABLE_CONFIG_V3;
};

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW GRAPH
// ─────────────────────────────────────────────────────────────────────────────

export function WorkflowGraph({ activeAgent, completedAgents, agents }: WorkflowGraphProps) {
  const config = getStableConfig();

  // Logic to determine dependency waiting states
  const getDependencyText = (agentId: string): string | undefined => {
    if (activeAgent === 'research' && agentId === 'architect') return 'Waiting for Research output...';
    if (activeAgent === 'pm' && agentId === 'architect') return 'Waiting for PM spec...';
    if (activeAgent === 'architect' && (agentId === 'database' || agentId === 'backend')) return 'Waiting for Architect output...';
    if ((activeAgent === 'database' || activeAgent === 'backend') && agentId === 'frontend') return 'Awaiting Backend + Database...';
    if (activeAgent === 'frontend' && agentId === 'qa') return 'Waiting for Frontend completion...';
    if (activeAgent === 'qa' && agentId === 'reviewer') return 'Blocked by QA validation...';
    return undefined;
  };

  const getAgentStatus = (agentId: string): AgentStatus => {
    if (activeAgent === agentId) {
      if (agentId === 'reviewer') return 'REVIEWING';
      if (agentId === 'backend' || agentId === 'frontend') return 'STREAMING';
      return 'THINKING';
    }
    if (completedAgents.includes(agentId)) return 'DONE';
    return 'WAITING';
  };

  const positions: Record<string, { x: number, y: number }> = {
    research: { x: 250, y: 50 },
    pm: { x: 550, y: 50 },
    architect: { x: 400, y: 200 },
    database: { x: 200, y: 350 },
    backend: { x: 600, y: 350 },
    frontend: { x: 400, y: 500 },
    qa: { x: 400, y: 650 },
    reviewer: { x: 400, y: 800 },
  };

  const derivedNodes = useMemo(() => agents.map((agent) => ({
    id: agent.id,
    type: 'agent',
    position: positions[agent.id] || { x: 400, y: 0 },
    data: {
      label: agent.name,
      icon: agent.icon,
      color: agent.color,
      status: getAgentStatus(agent.id),
      dependencyText: getDependencyText(agent.id),
    },
  })), [agents, activeAgent, completedAgents]);

  const edgeConnections = [
    { source: 'research', target: 'architect' },
    { source: 'pm', target: 'architect' },
    { source: 'architect', target: 'database' },
    { source: 'architect', target: 'backend' },
    { source: 'database', target: 'frontend' },
    { source: 'backend', target: 'frontend' },
    { source: 'frontend', target: 'qa' },
    { source: 'qa', target: 'reviewer' },
  ];

  const derivedEdges = useMemo(() => {
    return edgeConnections.map((conn) => {
      const isActive = activeAgent === conn.target || activeAgent === conn.source;
      const isCompleted = completedAgents.includes(conn.target);
      
      return {
        id: `e-${conn.source}-${conn.target}`,
        source: conn.source,
        target: conn.target,
        type: 'animated',
        data: { isActive, isCompleted },
        animated: false,
      };
    });
  }, [activeAgent, completedAgents]);

  const [nodes, setNodes, onNodesChange] = useNodesState(derivedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(derivedEdges);

  useEffect(() => { setNodes(derivedNodes); }, [derivedNodes, setNodes]);
  useEffect(() => { setEdges(derivedEdges); }, [derivedEdges, setEdges]);

  return (
    <div className="w-full h-full min-h-[600px] bg-transparent relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={config.nodeTypes}
        edgeTypes={config.edgeTypes}
        defaultEdgeOptions={config.defaultEdgeOptions}
        fitViewOptions={config.fitViewOptions}
        proOptions={config.proOptions}
        snapGrid={config.snapGrid}
        fitView
      >
        <Controls showInteractive={false} className="bg-zinc-900 border-white/5 fill-zinc-500 shadow-2xl" />
      </ReactFlow>

      <style jsx global>{`
        /* Ambient Grid Drift */
        .react-flow__background {
          animation: gridDrift 100s linear infinite;
        }
        @keyframes gridDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-24px, -24px); }
        }
        
        @keyframes flowAnimation {
          from { stroke-dashoffset: 12; }
          to { stroke-dashoffset: 0; }
        }

        .react-flow__controls-button { background: #09090b !important; border-bottom: 1px solid #18181b !important; }
        .react-flow__controls-button:hover { background: #18181b !important; }
        .react-flow__controls-button svg { fill: #52525b !important; }
      `}</style>
    </div>
  );
}