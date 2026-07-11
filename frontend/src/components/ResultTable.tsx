"use client";

import React, { useState } from 'react';
import { StatusPill } from './StatusPill';
import { Database, CheckCircle2, AlertTriangle, FileUp } from 'lucide-react';

interface ResultTableProps {
  data: any;
  onReset: () => void;
}

export function ResultTable({ data, onReset }: ResultTableProps) {
  const [activeTab, setActiveTab] = useState<"imported" | "skipped">("imported");

  const imported = data?.imported || [];
  const skipped = data?.skipped || [];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
           <div className="bg-blue-500/10 p-3 rounded-lg text-blue-600 shrink-0">
             <Database size={24} strokeWidth={2} />
           </div>
           <div>
             <p className="text-[13px] text-muted font-semibold tracking-wide uppercase">Total Rows</p>
             <p className="text-[28px] font-bold text-on-background leading-none mt-1.5">{data?.totalRows || 0}</p>
           </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
           <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-600 shrink-0">
             <CheckCircle2 size={24} strokeWidth={2} />
           </div>
           <div>
             <p className="text-[13px] text-muted font-semibold tracking-wide uppercase">Successfully Imported</p>
             <p className="text-[28px] font-bold text-on-background leading-none mt-1.5">{data?.importedCount || 0}</p>
           </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
           <div className="bg-error-container/50 p-3 rounded-lg text-on-error-container shrink-0">
             <AlertTriangle size={24} strokeWidth={2} />
           </div>
           <div>
             <p className="text-[13px] text-muted font-semibold tracking-wide uppercase">Skipped Rows</p>
             <p className="text-[28px] font-bold text-on-background leading-none mt-1.5">{data?.skippedCount || 0}</p>
           </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-border shadow-sm flex flex-col flex-1 min-h-0 relative">
        
        {/* Tabs Header */}
        <div className="flex items-center gap-8 px-6 border-b border-border bg-[#fafafa] rounded-t-[var(--radius-lg)] shrink-0">
          <button 
            className={`py-4 text-[14px] font-semibold transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-sm ${activeTab === 'imported' ? 'text-primary' : 'text-muted hover:text-on-background'}`}
            onClick={() => setActiveTab('imported')}
            aria-selected={activeTab === 'imported'}
            role="tab"
          >
            Imported Records ({imported.length})
            {activeTab === 'imported' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
          </button>
          <button 
            className={`py-4 text-[14px] font-semibold transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-sm ${activeTab === 'skipped' ? 'text-error' : 'text-muted hover:text-on-background'}`}
            onClick={() => setActiveTab('skipped')}
            aria-selected={activeTab === 'skipped'}
            role="tab"
          >
            Skipped Records ({skipped.length})
            {activeTab === 'skipped' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-error rounded-t-full"></div>}
          </button>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto bg-white min-h-0 relative">
           {activeTab === "imported" ? (
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead className="sticky top-0 bg-[#fafafa] shadow-[0_1px_0_var(--color-border)] z-10">
                 <tr>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50">Name</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50">Email</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50">Mobile</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50">Company</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50">Status</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider">Source</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {imported.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-16 text-center text-muted text-[14px]">No records were successfully imported.</td>
                   </tr>
                 ) : imported.map((record: any, idx: number) => (
                   <tr key={idx} className="hover:bg-[#fafafa]/50 transition-colors">
                     <td className="px-6 py-3.5 text-[13px] font-medium text-on-background border-r border-border/50">{record.name || <span className="text-muted/40 italic">Empty</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50">{record.email || <span className="text-muted/40 italic">Empty</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 font-mono">
                       {record.country_code ? `+${record.country_code} ` : ""}{record.mobile_without_country_code || <span className="text-muted/40 italic font-sans">Empty</span>}
                     </td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50">{record.company || <span className="text-muted/40 italic">Empty</span>}</td>
                     <td className="px-6 py-3.5 border-r border-border/50">
                       <StatusPill status={record.crm_status} />
                     </td>
                     <td className="px-6 py-3.5 text-[13px] text-muted">{record.data_source || "-"}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : (
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead className="sticky top-0 bg-[#fafafa] shadow-[0_1px_0_var(--color-border)] z-10">
                 <tr>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider w-[300px] border-r border-border/50">Skip Reason</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider">Raw Data (JSON)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {skipped.length === 0 ? (
                   <tr>
                     <td colSpan={2} className="p-16 text-center text-muted text-[14px]">No records were skipped. Perfect import!</td>
                   </tr>
                 ) : skipped.map((skip: any, idx: number) => (
                   <tr key={idx} className="hover:bg-error-container/20 transition-colors bg-error-container/5">
                     <td className="px-6 py-4 text-[13px] font-semibold text-on-error-container border-r border-border/50 align-top">
                       {skip.reason}
                     </td>
                     <td className="px-6 py-4 text-[12px] text-muted font-mono whitespace-pre-wrap align-top bg-[#fafafa]/50 leading-relaxed">
                       {JSON.stringify(skip.row, null, 2)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-white rounded-b-[var(--radius-lg)] shrink-0">
          <p className="text-[13px] text-muted font-medium">
            Import process completed successfully.
          </p>
          <button 
            onClick={onReset}
            className="px-5 py-2.5 text-[14px] font-medium text-on-background bg-white border border-border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm flex items-center gap-2"
          >
            <FileUp size={16} strokeWidth={2.5} />
            Import Another CSV
          </button>
        </div>
      </div>
    </div>
  );
}
