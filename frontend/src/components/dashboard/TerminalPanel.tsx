"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Log {
  agent: string;
  message: string;
  time: string;
}

interface TerminalPanelProps {
  logs: Log[];
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENT HSL PALETTE THEMES
// ─────────────────────────────────────────────────────────────────────────────

const getAgentTheme = (agent: string) => {
  const name = agent.toLowerCase();
  if (name.includes("manager") || name.includes("pm")) {
    return { border: "border-blue-500/30", bg: "bg-blue-950/10", text: "text-blue-400", glow: "rgba(59,130,246,0.15)" };
  }
  if (name.includes("research")) {
    return { border: "border-purple-500/30", bg: "bg-purple-950/10", text: "text-purple-400", glow: "rgba(168,85,247,0.15)" };
  }
  if (name.includes("architect")) {
    return { border: "border-orange-500/30", bg: "bg-orange-950/10", text: "text-orange-400", glow: "rgba(249,115,22,0.15)" };
  }
  if (name.includes("database") || name.includes("db") || name.includes("engineer")) {
    if (name.includes("backend")) {
      return { border: "border-red-500/30", bg: "bg-red-950/10", text: "text-red-400", glow: "rgba(239,68,68,0.15)" };
    }
    if (name.includes("frontend")) {
      return { border: "border-cyan-500/30", bg: "bg-cyan-950/10", text: "text-cyan-400", glow: "rgba(6,182,212,0.15)" };
    }
    return { border: "border-green-500/30", bg: "bg-green-950/10", text: "text-green-400", glow: "rgba(34,197,94,0.15)" };
  }
  if (name.includes("qa")) {
    return { border: "border-yellow-500/30", bg: "bg-yellow-950/10", text: "text-yellow-400", glow: "rgba(234,179,8,0.15)" };
  }
  if (name.includes("reviewer")) {
    return { border: "border-pink-500/30", bg: "bg-pink-950/10", text: "text-pink-400", glow: "rgba(236,72,153,0.15)" };
  }
  return { border: "border-blue-500/30", bg: "bg-blue-950/10", text: "text-blue-400", glow: "rgba(59,130,246,0.15)" };
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPEWRITER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TypewriterLog = ({ log, isLatest }: { log: Log; isLatest: boolean }) => {
  const [displayedText, setDisplayedText] = useState(isLatest ? "" : log.message);
  const theme = useMemo(() => getAgentTheme(log.agent), [log.agent]);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(log.message);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(log.message.slice(0, i + 1));
      i++;
      if (i >= log.message.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [log.message, isLatest]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className="space-y-1 group"
    >
      <div className="flex items-center justify-between px-1">
        <span className={`text-[9px] font-bold ${theme.text} uppercase tracking-widest font-mono`}>
          [{log.agent}]
        </span>
        <span className="text-[9px] text-zinc-700 font-mono">{log.time}</span>
      </div>
      <div 
        className={`p-2.5 rounded-xl border text-[11px] font-mono leading-relaxed transition-all duration-500 ${
          isLatest ? `${theme.bg} ${theme.border} text-zinc-200` : 'bg-white/[0.02] border-white/5 text-zinc-400'
        }`}
        style={isLatest ? { boxShadow: `inset 0 1px 0 0 ${theme.glow}` } : {}}
      >
        <span className={`${theme.text} mr-2 opacity-50`}>›</span>
        <span dangerouslySetInnerHTML={{ __html: formatLogMessage(displayedText) }} />
        {isLatest && (
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className={`inline-block w-1.5 h-3 ml-1 align-middle rounded-sm ${
              displayedText.length < log.message.length ? 'bg-zinc-400' : 'bg-zinc-600'
            }`}
          />
        )}
      </div>
    </motion.div>
  );
};

const formatLogMessage = (msg: string) => {
  return msg
    .replace(/error/gi, '<span class="text-red-400 font-bold">$&</span>')
    .replace(/success/gi, '<span class="text-green-400 font-bold">$&</span>')
    .replace(/generating/gi, '<span class="text-purple-400 font-medium">$&</span>')
    .replace(/analyzing/gi, '<span class="text-orange-400 font-medium">$&</span>')
    .replace(/complete/gi, '<span class="text-green-400 font-medium">$&</span>')
    .replace(/'([^']+)'/g, '<span class="text-blue-300">\'$1\'</span>');
};

// ─────────────────────────────────────────────────────────────────────────────
// TERMINAL PANEL
// ─────────────────────────────────────────────────────────────────────────────

export function TerminalPanel({ logs }: TerminalPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [logs]);

  // Derive simple timeline from logs (first log of each agent)
  const timeline = useMemo(() => {
    const seen = new Set<string>();
    const events: { time: string; text: string }[] = [];
    logs.forEach(log => {
      if (!seen.has(log.agent)) {
        seen.add(log.agent);
        events.push({ time: log.time, text: `${log.agent} Swarm Ingress` });
      }
    });
    return events;
  }, [logs]);

  return (
    <aside className="lg:w-96 w-full lg:border-l border-t lg:border-t-0 border-white/5 bg-black/60 flex flex-col backdrop-blur-3xl z-10 shadow-[-30px_0_60px_rgba(0,0,0,0.4)] h-72 lg:h-auto shrink-0">
      
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20 shadow-[inset_0_1px_0_0_rgba(59,130,246,0.2)]">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">Execution Trace</h2>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/20" />
        </div>
      </div>
      
      {/* Telemetry Timeline (Compact) */}
      <div className="h-32 border-b border-white/5 bg-black/20 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Telemetry Timeline</span>
        </div>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-2">
            {timeline.length === 0 ? (
              <span className="text-[10px] text-zinc-600 font-mono">No telemetry data.</span>
            ) : (
              timeline.map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} 
                  key={i} className="flex items-center gap-3"
                >
                  <span className="text-[9px] font-mono text-zinc-500 w-12">{event.time.split(' ')[0] || event.time}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400 truncate">{event.text}</span>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Logs Area */}
      <ScrollArea className="flex-1 p-5" viewportRef={scrollRef}>
        <div className="space-y-2 pb-4">
          {logs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center opacity-40 flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10" />
                <TerminalIcon className="w-10 h-10 text-zinc-500 relative" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">System idle</p>
              <p className="text-[9px] font-mono mt-2 text-zinc-600">Awaiting orchestration sequence...</p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <TypewriterLog key={`${log.time}-${i}`} log={log} isLatest={i === logs.length - 1} />
              ))}
            </AnimatePresence>
          )}
          <div className="h-4" />
        </div>
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 bg-black/80 border-t border-white/5 text-[9px] font-mono flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-bold">BASH</div>
          <span className="text-zinc-600">~/devpilot/workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">STRM:</span>
          {logs.length > 0 ? (
            <span className="animate-pulse text-green-400 font-bold">● ACTIVE</span>
          ) : (
            <span className="text-zinc-700">○ IDLE</span>
          )}
        </div>
      </div>
    </aside>
  );
}
