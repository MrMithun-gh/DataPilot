"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function ProcessingState() {
  return (
    <div 
      className="w-full max-w-[500px] bg-white rounded-xl border border-border shadow-sm flex flex-col mx-auto p-12 items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="bg-primary/10 p-4 rounded-2xl mb-6 text-primary">
        <Loader2 size={40} strokeWidth={2.5} className="animate-spin" />
      </div>
      <h2 className="text-[18px] font-semibold text-on-background leading-tight mb-3">
        Extracting lead data with AI...
      </h2>
      <p className="text-[14px] text-muted max-w-[320px] leading-relaxed">
        This might take a moment. We are matching columns, validating formats, and normalizing your CRM data.
      </p>
    </div>
  );
}
