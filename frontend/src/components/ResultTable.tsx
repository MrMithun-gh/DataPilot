"use client";

import React, { useState } from 'react';
import { StatusPill } from './StatusPill';
import { Database, CheckCircle2, AlertTriangle, FileUp, Download } from 'lucide-react';
import Papa from 'papaparse';
import { ApiResponse, CrmRecord, SkippedRecord } from '@/types/crm';

interface ResultTableProps {
  data: ApiResponse | null;
  onReset: () => void;
  originalFilename?: string;
}

export function ResultTable({ data, onReset, originalFilename = "export.csv" }: ResultTableProps) {
  const [activeTab, setActiveTab] = useState<"imported" | "skipped">("imported");

  const imported = data?.imported || [];
  const skipped = data?.skipped || [];

  const renderCrmNote = (note: string) => {
    if (!note) return <span className="text-muted/40 italic font-sans">—</span>;
    const lines = note.split(/(?:\n|\\n)/);
    return (
      <div className="flex flex-col gap-1 whitespace-normal">
        {lines.map((line, i) => {
          const colonIndex = line.indexOf(': ');
          if (colonIndex > -1) {
            const heading = line.substring(0, colonIndex + 1);
            const value = line.substring(colonIndex + 1);
            return (
              <div key={i} className="leading-snug">
                <strong className="font-semibold text-on-background dark:text-gray-200">{heading}</strong>{value}
              </div>
            );
          }
          return <div key={i} className="leading-snug">{line}</div>;
        })}
      </div>
    );
  };


  const handleDownload = () => {
    if (imported.length === 0) return;

    const exportData = imported.map((record: CrmRecord) => ({
      created_at: record.created_at || "",
      name: record.name || "",
      email: record.email || "",
      country_code: record.country_code || "",
      mobile_without_country_code: record.mobile_without_country_code || "",
      company: record.company || "",
      city: record.city || "",
      state: record.state || "",
      country: record.country || "",
      lead_owner: record.lead_owner || "",
      crm_status: record.crm_status || "",
      crm_note: record.crm_note || "",
      data_source: record.data_source || "",
      possession_time: record.possession_time || "",
      description: record.description || ""
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const baseName = originalFilename.replace(/\.[^/.]+$/, "");
    link.setAttribute("download", `${baseName}_processed.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Stats Cards */}
      <div className="flex flex-row items-center mb-4 shrink-0 bg-white dark:bg-[#18181b] rounded-lg border border-border p-1.5 shadow-sm divide-x divide-border">
        <div className="flex flex-1 items-center justify-center gap-3 px-4 py-2">
           <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-md text-blue-600 dark:text-blue-400 shrink-0">
             <Database size={18} strokeWidth={2.5} />
           </div>
           <div className="flex items-baseline gap-2">
             <p className="text-[12px] text-muted font-semibold tracking-wide uppercase">Total</p>
             <p className="text-[20px] font-bold text-on-background leading-none">{data?.totalRows || 0}</p>
           </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3 px-4 py-2">
           <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-2 rounded-md text-emerald-600 dark:text-emerald-400 shrink-0">
             <CheckCircle2 size={18} strokeWidth={2.5} />
           </div>
           <div className="flex items-baseline gap-2">
             <p className="text-[12px] text-muted font-semibold tracking-wide uppercase">Imported</p>
             <p className="text-[20px] font-bold text-on-background leading-none">{data?.importedCount || 0}</p>
           </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3 px-4 py-2">
           <div className="bg-error-container/50 p-2 rounded-md text-on-error-container shrink-0">
             <AlertTriangle size={18} strokeWidth={2.5} />
           </div>
           <div className="flex items-baseline gap-2">
             <p className="text-[12px] text-muted font-semibold tracking-wide uppercase">Skipped</p>
             <p className="text-[20px] font-bold text-on-background leading-none">{data?.skippedCount || 0}</p>
           </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#18181b] rounded-[var(--radius-lg)] border border-border shadow-sm flex flex-col flex-1 min-h-0 relative">
        
        {/* Tabs Header */}
        <div className="flex items-center gap-8 px-6 border-b border-border bg-[#fafafa] dark:bg-[#09090b] rounded-t-[var(--radius-lg)] shrink-0">
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
        <div className="flex-1 overflow-auto bg-white dark:bg-[#18181b] min-h-0 relative">
           {activeTab === "imported" ? (
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead className="sticky top-0 bg-[#fafafa] dark:bg-[#09090b] shadow-[0_1px_0_var(--color-border)] z-10">
                 <tr>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Created At</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Name</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Email</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Country Code</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Mobile</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Company</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">City</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Country</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Lead Owner</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">Status</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-r border-border/50 whitespace-nowrap">CRM Note</th>
                   <th className="px-6 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider whitespace-nowrap">Source</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {imported.length === 0 ? (
                   <tr>
                     <td colSpan={12} className="p-16 text-center text-muted text-[14px]">No records were successfully imported.</td>
                   </tr>
                 ) : imported.map((record: CrmRecord, idx: number) => (
                   <tr 
                     key={idx}
                     className="hover:bg-[#fafafa] dark:bg-[#09090b]/50 transition-colors"
                   >
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">{record.created_at || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] font-medium text-on-background border-r border-border/50 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">{record.name || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">{record.email || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 font-mono whitespace-nowrap">
                       {record.country_code ? record.country_code : <span className="text-muted/40 italic font-sans">—</span>}
                     </td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 font-mono whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis">
                       {record.mobile_without_country_code || <span className="text-muted/40 italic font-sans">—</span>}
                     </td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">{record.company || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis">{record.city || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis">{record.country || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">{record.lead_owner || <span className="text-muted/40 italic">—</span>}</td>
                     <td className="px-6 py-3.5 border-r border-border/50 whitespace-nowrap">
                       <StatusPill status={record.crm_status} />
                     </td>
                     <td className="px-6 py-3.5 text-[13px] text-muted border-r border-border/50 font-mono max-w-[300px] align-top">
                       {renderCrmNote(record.crm_note)}
                     </td>
                     <td className="px-6 py-3.5 text-[13px] text-muted whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis">{record.data_source || <span className="text-muted/40 italic">—</span>}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : (
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead className="sticky top-0 bg-[#fafafa] dark:bg-[#09090b] shadow-[0_1px_0_var(--color-border)] z-10">
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
                 ) : skipped.map((skip: SkippedRecord, idx: number) => (
                   <tr key={idx} className="hover:bg-error-container/20 transition-colors bg-error-container/5">
                     <td className="px-6 py-4 text-[13px] font-semibold text-on-error-container border-r border-border/50 align-top">
                       {skip.reason}
                     </td>
                     <td className="px-6 py-4 text-[12px] text-muted font-mono whitespace-pre-wrap align-top bg-[#fafafa] dark:bg-[#09090b]/50 leading-relaxed">
                       {JSON.stringify(skip.row, null, 2)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-white dark:bg-[#18181b] rounded-b-[var(--radius-lg)] shrink-0">
          <p className="text-[13px] text-muted font-medium">
            Import process completed successfully.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleDownload}
              disabled={imported.length === 0}
              className="px-5 py-2.5 text-[14px] font-medium text-on-background bg-white dark:bg-[#18181b] border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272a] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} strokeWidth={2.5} />
              Download CSV
            </button>
            <button 
              onClick={onReset}
              className="px-5 py-2.5 text-[14px] font-medium text-on-background bg-white dark:bg-[#18181b] border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272a] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm flex items-center gap-2"
            >
              <FileUp size={16} strokeWidth={2.5} />
              Import Another CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
