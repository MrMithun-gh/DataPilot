import React from 'react';

interface StatusPillProps {
  status: string;
}

export function StatusPill({ status }: StatusPillProps) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  let label = status;

  switch (status) {
    case "GOOD_LEAD_FOLLOW_UP":
      bgColor = "bg-emerald-500/10";
      textColor = "text-emerald-700";
      label = "Good Lead";
      break;
    case "DID_NOT_CONNECT":
      bgColor = "bg-amber-500/10";
      textColor = "text-amber-700";
      label = "Did Not Connect";
      break;
    case "BAD_LEAD":
      bgColor = "bg-error-container/50";
      textColor = "text-on-error-container";
      label = "Bad Lead";
      break;
    case "SALE_DONE":
      bgColor = "bg-primary/10";
      textColor = "text-primary";
      label = "Sale Done";
      break;
    default:
      if (!status) {
        bgColor = "bg-gray-100";
        textColor = "text-gray-500";
        label = "Empty";
      }
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-chip)] text-[11px] font-bold uppercase tracking-wider ${bgColor} ${textColor} whitespace-nowrap shadow-sm border border-black/5`}>
      {label}
    </span>
  );
}
