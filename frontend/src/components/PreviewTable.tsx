"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { X, FileText, AlertCircle } from "lucide-react";

interface PreviewTableProps {
  file: File;
  onCancel: () => void;
  onConfirm: () => void;
  submitError?: string | null;
}

export function PreviewTable({ file, onCancel, onConfirm, submitError }: PreviewTableProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          setParseError(results.errors[0].message);
        } else {
          setHeaders(results.meta.fields || []);
          setData(results.data as Record<string, unknown>[]);
        }
      },
      error: (error) => {
        setParseError(error.message);
      }
    });
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div 
      className="w-full max-w-6xl mx-auto bg-white dark:bg-[#18181b] rounded-[var(--radius-lg)] border border-border shadow-sm flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-labelledby="preview-modal-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 bg-[#fafafa] dark:bg-[#09090b] px-3 py-1.5 rounded-[var(--radius-btn)] border border-border max-w-[80%] overflow-hidden">
          <FileText size={16} className="text-muted shrink-0" strokeWidth={2} />
          <span className="text-[13px] font-medium text-on-background truncate" id="preview-modal-title" title={file.name}>
            {file.name}
          </span>
          <span className="text-[13px] text-muted font-mono shrink-0">({formatFileSize(file.size)})</span>
        </div>
        <button 
          onClick={onCancel} 
          className="p-1.5 text-muted hover:text-on-background hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 shrink-0"
          aria-label="Close Preview"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Subheader */}
      <div className="flex flex-col border-b border-border bg-[#fafafa] dark:bg-[#09090b] shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <h3 className="text-[11px] font-semibold text-on-background tracking-wider uppercase">
            PREVIEW — {data.length} ROWS DETECTED
          </h3>
          <div className="flex items-center gap-2 text-[12px] font-medium text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"></span>
            Raw Data Preview
          </div>
        </div>
        
        {/* Backend Submission Error Banner */}
        {submitError && (
          <div className="px-6 py-3 bg-error-container/50 border-t border-error/20 flex items-start gap-2.5 text-on-error-container text-[13px]" role="alert">
            <AlertCircle size={16} className="shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <span className="font-bold">Import failed:</span> {submitError}
            </div>
          </div>
        )}
      </div>

      {/* Table Body (Scrollable) */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#18181b] min-h-0 relative">
        {parseError ? (
          <div className="p-10 flex items-center justify-center h-full">
            <div className="text-error bg-error-container/50 px-6 py-4 rounded-lg border border-error/20 flex flex-col items-center">
               <span className="font-medium">Failed to parse CSV</span>
               <span className="text-sm mt-1">{parseError}</span>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-[#fafafa] dark:bg-[#09090b] shadow-[0_1px_0_var(--color-border)] z-10">
              <tr>
                <th className="px-6 py-3 text-[11px] font-semibold text-muted uppercase tracking-wider w-[50px] border-r border-border/50">
                  #
                </th>
                {headers.map((header) => (
                  <th key={header} className="px-6 py-3 text-[11px] font-semibold text-on-background uppercase tracking-wider whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-[#fafafa] dark:bg-[#09090b]/50 transition-colors">
                  <td className="px-6 py-2.5 text-[12px] text-muted italic border-r border-border/50 bg-[#fafafa] dark:bg-[#09090b]/30">
                    {index + 1}
                  </td>
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-2.5 text-[13px] text-on-background whitespace-nowrap max-w-[250px] overflow-hidden text-ellipsis">
                      {(row[header] as string) || <span className="text-muted/40 italic">Empty</span>}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && !parseError && (
                <tr>
                  <td colSpan={headers.length + 1} className="p-12 text-center text-muted text-[13px]">
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                      Parsing CSV data...
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-white dark:bg-[#18181b] rounded-b-[var(--radius-lg)] shrink-0">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-[14px] font-medium text-on-background bg-white dark:bg-[#18181b] border border-border rounded-[var(--radius-btn)] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm}
          disabled={data.length === 0}
          className="px-4 py-2 text-[14px] font-medium text-on-primary bg-primary rounded-[var(--radius-btn)] hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Import
        </button>
      </div>
    </div>
  );
}
