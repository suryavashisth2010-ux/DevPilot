"use client";

import React, { useState, useEffect } from 'react';
import { Play, Square, Heart, Award, Flame, Activity, Zap, Video, Calendar } from 'lucide-react';

export default function FitnessDashboard({ name }: { name: string }) {
  const [heartRate, setHeartRate] = useState(72);
  const [activeCalories, setActiveCalories] = useState(140);
  const [isCoaching, setIsCoaching] = useState(false);
  const [formFeedback, setFormFeedback] = useState("Perfect stance. Awaiting squat depth...");
  const [formScore, setFormScore] = useState(98);
  const [repCount, setRepCount] = useState(0);

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
        
        // Randomly simulate rep count & form feedback
        if (Math.random() > 0.75) {
          setRepCount(prev => prev + 1);
          setFormScore(prev => Math.max(92, Math.min(100, prev + (Math.random() > 0.5 ? 1 : -1))));
          
          const tips = [
            "Perfect squat depth! Hip crease below knees.",
            "Keep your chest upright on lift-off.",
            "Drive hard through your heels.",
            "Slow down the eccentric phase.",
            "Exhale on extension!"
          ];
          setFormFeedback(tips[Math.floor(Math.random() * tips.length)]);
        }
      }, 1200);
    } else {
      setHeartRate(72);
      setRepCount(0);
    }
    return () => clearInterval(interval);
  }, [isCoaching]);

  return (
    <div className="p-6 bg-zinc-950 min-h-[500px] text-zinc-100 font-sans select-none rounded-[2rem] border border-white/5 m-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-base font-bold flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              FitAI: {name}
            </h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Pose-Telemetry Personal Coach</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-mono tracking-tight text-zinc-400 font-bold uppercase">Biometric HUD Stream</span>
          </div>
        </header>

        {/* Dynamic Biometrics Panel */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Heart Rate", val: `${heartRate} BPM`, desc: isCoaching ? "Target: Zone 3" : "Resting", icon: Heart, color: "text-red-400" },
            { label: "Active Calories", val: `${activeCalories} KCAL`, desc: "Goal: 500 KCAL", icon: Flame, color: "text-orange-400" },
            { label: "Form Accuracy", val: `${formScore}%`, desc: "Barbell Squat Depth", icon: Award, color: "text-yellow-400" },
            { label: "Reps Counted", val: `${repCount} / 8`, desc: "Active Squat Set", icon: Activity, color: "text-blue-400" },
          ].map((card) => (
            <div key={card.label} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[100px]">
              <div className="flex justify-between items-start">
                <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">{card.label}</span>
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
              <div className="mt-2">
                <span className="text-xl font-mono font-bold tracking-tight text-white">{card.val}</span>
                <p className="text-[9px] text-zinc-500 mt-0.5">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Central Workspace: Video Feed vs. Routine */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Pose Estimation Screen (Left) */}
          <div className="col-span-8 border border-white/5 rounded-3xl bg-zinc-900/50 p-5 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
            <div className="flex justify-between items-center z-10">
              <span className="px-2.5 py-0.5 text-[8px] bg-red-500/10 border border-red-500/20 rounded-full font-bold text-red-400 tracking-widest uppercase font-mono">
                {isCoaching ? "LIVE HUD FEED" : "STANDBY FEED"}
              </span>
              <button 
                onClick={() => setIsCoaching(!isCoaching)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  isCoaching ? "bg-red-600 hover:bg-red-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {isCoaching ? (
                  <>Stop Workout <Square className="w-2.5 h-2.5" /></>
                ) : (
                  <>Start Live Coach <Play className="w-2.5 h-2.5 fill-current" /></>
                )}
              </button>
            </div>

            {/* Simulated camera capture screen */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
              {isCoaching ? (
                <div className="relative w-full h-full border border-blue-500/20 rounded-2xl bg-zinc-950/60 overflow-hidden flex flex-col justify-center items-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse" />
                  
                  {/* Grid lines resembling face/body landmarks */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border border-blue-500/40 border-dashed animate-spin duration-3000" />
                  <div className="absolute top-32 left-1/2 -translate-x-1/2 w-32 h-1 bg-blue-500/40 animate-pulse" />
                  <div className="absolute top-32 left-1/4 w-10 h-24 border-l border-b border-blue-500/30" />
                  <div className="absolute top-32 right-1/4 w-10 h-24 border-r border-b border-blue-500/30" />
                  
                  <span className="text-zinc-600 text-[8px] font-mono absolute bottom-3">Coordinates mapping: Hip(0.42, 0.72) Knee(0.40, 0.91)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center opacity-30">
                  <Video className="w-10 h-10 text-zinc-500" />
                  <p className="text-[10px]">Camera standby. Press "Start Live Coach" to launch pose recognition.</p>
                </div>
              )}
            </div>

            {/* Telemetry log feedback */}
            {isCoaching && (
              <div className="z-10 bg-black/80 border border-white/5 p-3.5 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span className="text-[8px] uppercase tracking-wider font-bold text-zinc-500">Coach Feedback</span>
                </div>
                <p className="text-xs font-semibold text-white">{formFeedback}</p>
              </div>
            )}

          </div>

          {/* Workout Routine Card (Right) */}
          <div className="col-span-4 border border-white/5 rounded-3xl bg-zinc-900/30 p-5 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Planned routine</h3>
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div className="space-y-2">
                {[
                  { name: "Barbell Squats", sets: "4 Sets", reps: "8 Reps", weight: "225 lbs", done: isCoaching },
                  { name: "Romanian Deadlifts", sets: "3 Sets", reps: "10 Reps", weight: "185 lbs", done: false },
                  { name: "Leg Press", sets: "3 Sets", reps: "12 Reps", weight: "360 lbs", done: false },
                ].map((ex) => (
                  <div key={ex.name} className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                    ex.done ? "bg-blue-500/5 border-blue-500/20 text-white" : "bg-white/[0.01] border-white/5 text-zinc-400"
                  }`}>
                    <div>
                      <div className="text-[10px] font-bold">{ex.name}</div>
                      <div className="text-[8px] text-zinc-500 mt-0.5">{ex.sets} × {ex.reps}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-300">{ex.weight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-3 border-t border-white/5 mt-4">
              <span className="text-[8px] uppercase tracking-wider text-zinc-600 font-bold block mb-1">Target Muscles</span>
              <div className="flex gap-1.5 flex-wrap">
                {["Quads", "Glutes", "Hamstrings"].map(m => (
                  <span key={m} className="px-2 py-0.5 bg-white/5 border border-white/5 text-[8px] text-zinc-400 rounded-md font-mono">{m}</span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
