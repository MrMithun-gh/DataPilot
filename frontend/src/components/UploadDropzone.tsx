"use client";

import React, { useState, useRef } from "react";
import { CloudUpload, AlertCircle, Info, X } from "lucide-react";

interface UploadDropzoneProps {
  onUpload?: (file: File) => void;
  onCancel?: () => void;
}

export function UploadDropzone({ onUpload, onCancel }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      setError("Please upload a valid .csv file.");
      return false;
    }
    // 5MB limit based on backend contract
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds the 5MB limit.");
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClose = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    resetState();
    if (onCancel) onCancel();
  };

  const handleDownloadSample = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const csvContent = `Customer Name,Mail ID,Cell,Buyer,Executive,Remarks,Location,Company Name\nJohn Doe,john@example.com,555-1234,Yes,Jane Smith,Call back tomorrow,New York,Acme Corp\nAlice,alice@test.com,555-5678,No,Bob,Not interested,London,Globex\nCharlie Brown,,,Yes,Jane Smith,Urgent,Chicago,Stark Ind`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample-leads-messy.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="w-full max-w-[640px] bg-white rounded-xl border border-border shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col mx-auto"
      role="dialog"
      aria-labelledby="upload-modal-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-border shrink-0">
        <div>
          <h2 id="upload-modal-title" className="text-[18px] font-semibold text-on-background leading-tight">
            Import Leads via CSV
          </h2>
          <p className="text-[14px] text-muted mt-1">
            Upload a CSV file to bulk create leads.
          </p>
        </div>
        <button 
          onClick={handleClose}
          className="p-1.5 text-muted hover:text-on-background hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          aria-label="Close modal and reset"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col gap-6 overflow-y-auto">
        {/* Dropzone */}
        <div
          className={`relative border-2 border-dashed rounded-xl px-6 py-14 flex flex-col items-center justify-center transition-all cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
            ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50 bg-[#fafafa]/50"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Click or drag and drop a CSV file to upload"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleChange}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3.5 rounded-xl mb-4 text-primary">
                <CloudUpload size={32} strokeWidth={2} />
              </div>
              <p className="text-[16px] font-semibold text-on-background">
                Drop your CSV file here
              </p>
              <p className="text-[14px] text-muted mt-1">
                or click to browse files
              </p>
              <p className="text-[13px] text-muted/80 mt-5">
                Supported file: .csv
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3.5 rounded-xl mb-4 text-primary">
                <CloudUpload size={32} strokeWidth={2} />
              </div>
              <p className="text-[16px] font-semibold text-on-background truncate max-w-xs sm:max-w-md px-4 text-center">
                {selectedFile.name}
              </p>
              <p className="text-[14px] text-muted mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={handleClose}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClose(e);
                }}
                className="mt-5 text-[14px] font-medium text-error hover:underline focus:outline-none focus:ring-2 focus:ring-error rounded px-2 py-0.5"
                aria-label="Remove selected file"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="p-3.5 rounded-lg bg-error-container text-on-error-container flex items-start gap-2.5 text-[14px] border border-error/20 shadow-sm"
            role="alert"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" strokeWidth={2} />
            <span className="font-medium leading-snug">{error}</span>
          </div>
        )}

        {/* Requirements Info */}
        <div className="bg-[#fafafa] rounded-xl p-5 border border-border">
          <div className="flex gap-3.5">
            <Info size={20} className="text-muted shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-[14px] font-semibold text-on-background">
                Required CSV Headers:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Customer Name", "Mail ID", "Cell", "Company Name"].map((header) => (
                  <span
                    key={header}
                    className="bg-white border border-border px-3 py-1 rounded-md text-[13px] font-mono text-muted shadow-sm"
                  >
                    {header}
                  </span>
                ))}
              </div>
              <button 
                className="text-[14px] text-primary hover:underline mt-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 -ml-1 transition-colors"
                onClick={handleDownloadSample}
                type="button"
              >
                Download Sample CSV Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-7 py-5 border-t border-border flex justify-end gap-3 bg-white rounded-b-xl shrink-0">
        <button 
          onClick={handleClose}
          className="px-5 py-2.5 text-[14px] font-medium text-on-background bg-white border border-border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm"
          type="button"
        >
          Cancel
        </button>
        <button 
          onClick={() => selectedFile && onUpload?.(selectedFile)}
          disabled={!selectedFile}
          className="px-5 py-2.5 text-[14px] font-medium text-on-primary bg-primary rounded-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          type="button"
        >
          Upload File
        </button>
      </div>
    </div>
  );
}
