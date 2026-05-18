"use client";

import React, { useState } from 'react';
import { Layers, Plus, Calendar, AlertCircle, Award, CheckSquare, Sparkles } from 'lucide-react';

export default function KanbanDashboard({ name }: { name: string }) {
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
    <div className="p-6 bg-zinc-950 min-h-[500px] text-zinc-100 font-sans select-none rounded-[2rem] border border-white/5 m-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-base font-bold flex items-center gap-2 text-white">
              <Layers className="w-4 h-4 text-blue-500" />
              Workspace Board: {name}
            </h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">High Performance Kanban Backlog</p>
          </div>
          <form onSubmit={handleCreate} className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <input 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Fast create ticket..." 
              className="border-none bg-transparent focus:ring-0 text-[10px] px-3 text-white placeholder:text-zinc-700 h-7 outline-none"
            />
            <button type="submit" className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </header>

        {/* Board Lanes */}
        <div className="grid grid-cols-4 gap-4">
          {lanes.map((lane) => {
            const laneIssues = issues.filter(issue => issue.lane === lane.id);
            return (
              <div key={lane.id} className="p-3.5 rounded-2xl bg-zinc-900/20 border border-white/5 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{lane.label}</span>
                  <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full font-bold">{laneIssues.length}</span>
                </div>
                
                <div className="flex-1 space-y-2.5 overflow-y-auto scrollbar-none">
                  {laneIssues.map((issue) => (
                    <div key={issue.id} className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between min-h-[90px] shadow-sm relative group cursor-pointer">
                      <div>
                        <span className="text-[8px] font-mono text-blue-400 font-bold">{issue.id}</span>
                        <h4 className="text-[10px] font-bold text-zinc-200 mt-1 leading-normal">{issue.title}</h4>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                        <span className="text-[8px] text-zinc-500 font-mono">{issue.assignee}</span>
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
}
