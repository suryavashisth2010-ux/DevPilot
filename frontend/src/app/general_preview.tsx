"use client";

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, HardDrive, Cpu, Terminal } from 'lucide-react';

export default function GenericDashboard({ name }: { name: string }) {
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
    <div className="p-6 bg-zinc-950 min-h-[500px] text-zinc-100 font-sans select-none rounded-[2rem] border border-white/5 m-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-base font-bold flex items-center gap-2 text-white">
              <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
              DevPilot: {name}
            </h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Telemetry Infrastructure Monitoring</p>
          </div>
          <span className="px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] text-green-400 font-bold uppercase tracking-widest font-mono">
            System Operational
          </span>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 gap-5">
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between min-h-[80px]">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">CPU Burden</span>
              <h2 className="text-xl font-mono font-bold text-white mt-1">{load}%</h2>
            </div>
            <Cpu className="w-6 h-6 text-blue-500 opacity-60" />
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between min-h-[80px]">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Database Health</span>
              <h2 className="text-xl font-mono font-bold text-green-500 mt-1">100%</h2>
            </div>
            <ShieldCheck className="w-6 h-6 text-green-500 opacity-60" />
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between min-h-[80px]">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Memory Load</span>
              <h2 className="text-xl font-mono font-bold text-white mt-1">4.2 GB</h2>
            </div>
            <HardDrive className="w-6 h-6 text-purple-500 opacity-60" />
          </div>
        </div>

        {/* Dynamic Telemetry Console Preview */}
        <div className="p-5 border border-white/5 rounded-3xl bg-zinc-900/30 flex flex-col justify-between min-h-[180px] shadow-lg relative">
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/5">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">System Event Stream</span>
          </div>
          <div className="space-y-1.5 font-mono text-[9px] text-zinc-500 flex-1">
            <div>[15:42:01] Ingested raw SaaS concept prompt...</div>
            <div>[15:42:02] Initialized langgraph multi-agent coordination swarm...</div>
            <div>[15:42:04] Systems Architect mapping decoupling bounds...</div>
            <div className="text-blue-400 font-bold">[15:42:05] Scaffold packaging finished successfully. Ready for build.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
