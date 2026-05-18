"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, LucideIcon } from "lucide-react";

interface AgentCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  isActive: boolean;
  isCompleted: boolean;
}

export function AgentCard({ id, name, icon: Icon, color, isActive, isCompleted }: AgentCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 4 }}
      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
        isActive 
          ? "bg-blue-500/10 border-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
          : isCompleted
            ? "bg-white/5 border-white/5 text-zinc-400"
            : "border-transparent text-zinc-500"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isActive ? "bg-blue-500/20" : "bg-white/5"}`}>
          <Icon className={`w-4 h-4 ${isActive ? color : "text-zinc-500"}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          {isActive && (
            <span className="text-[10px] text-blue-400 animate-pulse font-mono uppercase tracking-tighter">
              Thinking...
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {isActive ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <Circle className="w-4 h-4 text-zinc-700" />
        )}
      </div>
    </motion.div>
  );
}
