"use client";

import React from "react";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

interface ProcessingStateProps {
  stage?: "uploading" | "processing" | "finalizing";
}

export function ProcessingState({ stage = "processing" }: ProcessingStateProps) {
  const stages = [
    { id: "uploading", label: "Uploading file" },
    { id: "processing", label: "Processing with AI" },
    { id: "finalizing", label: "Finalizing results" },
  ];

  const stageIndex = stages.findIndex(s => s.id === stage);

  return (
    <div 
      className="w-full max-w-[500px] bg-white dark:bg-[#18181b] rounded-xl border border-border dark:border-[#27272a] shadow-sm flex flex-col mx-auto p-10 items-center text-left animate-in fade-in zoom-in-95 duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="bg-primary/10 p-4 rounded-2xl mb-5 text-primary">
        <Loader2 size={32} strokeWidth={2.5} className="animate-spin" />
      </div>
      <h2 className="text-[18px] font-semibold text-on-background dark:text-white leading-tight mb-6">
        Import in progress
      </h2>
      
      {/* Indeterminate Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-[#27272a] rounded-full overflow-hidden mb-8 relative">
        <div className="absolute top-0 bottom-0 left-0 bg-primary rounded-full w-[30%] animate-progress"></div>
      </div>
      
      {/* Checklist */}
      <div className="w-full flex flex-col gap-4">
        {stages.map((s, idx) => {
          const isComplete = stageIndex > idx;
          const isActive = stageIndex === idx;
          
          return (
            <div key={s.id} className={`flex items-center gap-3 ${isActive ? 'opacity-100' : isComplete ? 'opacity-70' : 'opacity-40'}`}>
              {isComplete ? (
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              ) : isActive ? (
                <Loader2 size={20} className="text-primary animate-spin shrink-0" />
              ) : (
                <Circle size={20} className="text-muted shrink-0" />
              )}
              <span className={`text-[14px] ${isActive ? 'font-semibold text-on-background dark:text-white' : 'font-medium text-muted dark:text-muted'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
