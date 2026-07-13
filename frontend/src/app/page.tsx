"use client";

import { useState, useEffect } from "react";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PreviewTable } from "@/components/PreviewTable";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultTable } from "@/components/ResultTable";
import { FileUp, Sun, Moon } from "lucide-react";
import { ApiResponse } from "@/types/crm";

type ImportState = "upload" | "preview" | "processing" | "result";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [importState, setImportState] = useState<ImportState>("upload");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ApiResponse | null>(null);
  const [history, setHistory] = useState<{id: string, filename: string, timestamp: string, data: ApiResponse}[]>([]);
  const [processingStage, setProcessingStage] = useState<"uploading" | "processing" | "finalizing">("uploading");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("DataPilotHistory");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load history from localStorage", e);
    }
  }, []);

  const saveToHistory = (filename: string, resultData: ApiResponse) => {
    try {
      const newEntry = {
        id: Date.now().toString(),
        filename,
        timestamp: new Date().toISOString(),
        data: resultData
      };
      
      const updated = [newEntry, ...history].slice(0, 20);
      setHistory(updated);
      localStorage.setItem("DataPilotHistory", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save history to localStorage", e);
    }
  };

  const clearHistory = () => {
    try {
      setHistory([]);
      localStorage.removeItem("DataPilotHistory");
    } catch (e) {
      console.warn("Could not clear history from localStorage", e);
    }
  };

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setSubmitError(null);
    setImportState("preview");
  };

  const handleCancel = () => {
    setFile(null);
    setSubmitError(null);
    setImportResult(null);
    setImportState("upload");
  };

  const handleConfirm = async () => {
    if (!file) return;
    
    setImportState("processing");
    setProcessingStage("uploading");
    setSubmitError(null);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setSubmitError("NEXT_PUBLIC_API_URL is not configured.");
      setImportState("preview");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    const uploadFile = () => {
      return new Promise<ApiResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${apiUrl}/api/import`);
        
        xhr.upload.onload = () => {
          setProcessingStage("processing");
        };
        
        xhr.onload = () => {
          setProcessingStage("finalizing");
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data as ApiResponse);
            } else {
              reject(new Error(data.error || "Failed to import leads. Please try again."));
            }
          } catch {
            reject(new Error("Received an invalid response from the server."));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error("An unexpected error occurred while communicating with the server."));
        };
        
        xhr.send(formData);
      });
    };

    try {
      const data = await uploadFile();
      // Success
      setImportResult(data);
      setImportState("result");
      saveToHistory(file.name, data);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "An unexpected error occurred.");
      setImportState("preview");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-sans bg-white dark:bg-[#09090b] text-on-background transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-[#2d2d30] dark:border-[#27272a] shrink-0 flex flex-col bg-[#1c1c1f] dark:bg-[#000000] md:min-h-screen z-20 shadow-xl transition-colors duration-200">
        <div className="flex items-center gap-3 mb-8 px-6 pt-7">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-[15px] shadow-sm">D</div>
          <div>
            <h1 className="text-white text-[16px] font-bold leading-tight tracking-wide">DataPilot</h1>
            <p className="text-muted text-[13px] font-medium mt-0.5">AI CRM Import</p>
          </div>
        </div>
        
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible px-4 pb-4 md:pb-0" aria-label="Sidebar Navigation">
          <button 
            onClick={handleCancel}
            className={`w-full text-left px-4 py-2.5 text-[14px] text-white ${importState !== "result" ? "bg-white/10" : "hover:bg-white/5 text-muted"} rounded-lg cursor-pointer flex items-center gap-3 relative md:before:content-[''] md:before:absolute md:before:-left-4 md:before:w-1 md:before:h-6 ${importState !== "result" ? "md:before:bg-primary" : ""} md:before:rounded-r-full font-semibold transition-colors shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
            aria-current="page"
          >
            <FileUp size={18} strokeWidth={2.5} className="text-[#c3c0ff]" />
            New Import
          </button>

          {history.length > 0 && (
            <div className="mt-4 md:mt-6 mb-2 flex items-center justify-between px-2">
              <h2 className="text-[11px] font-semibold text-muted uppercase tracking-wider">Recent Imports</h2>
              <button 
                onClick={clearHistory}
                className="text-[11px] text-muted hover:text-white transition-colors"
                title="Clear History"
              >
                Clear
              </button>
            </div>
          )}

          {history.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setFile(new File([], item.filename));
                setImportResult(item.data);
                setImportState("result");
              }}
              className="w-full text-left px-4 py-2.5 text-[13px] text-muted hover:text-white hover:bg-white/5 rounded-lg cursor-pointer flex flex-col gap-0.5 transition-colors shrink-0 truncate focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="truncate w-full font-medium">{item.filename}</span>
              <span className="text-[11px] opacity-70">{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 relative flex flex-col min-h-screen overflow-hidden bg-[#fafafa] dark:bg-[#09090b] transition-colors duration-200">
        {/* Header */}
        <header className="h-16 border-b border-border dark:border-[#27272a] bg-white dark:bg-[#18181b] flex items-center justify-between px-8 shrink-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-200">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2.5 text-[14px] text-muted font-medium">
              <li>
                <button className="hover:text-on-background dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">Workspace</button>
              </li>
              <li aria-hidden="true" className="text-border dark:text-[#3f3f46]">/</li>
              <li>
                <span className="text-on-background dark:text-white font-semibold" aria-current="page">New Import</span>
              </li>
            </ol>
          </nav>
          <button 
            onClick={toggleDark}
            className="p-2 rounded-md text-muted hover:bg-gray-100 dark:hover:bg-[#27272a] hover:text-on-background dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative p-6 md:p-12 flex flex-col items-center">
          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[500px]">
            {importState === "upload" && (
              <div className="w-full flex justify-center">
                <UploadDropzone onUpload={handleUpload} onCancel={handleCancel} />
              </div>
            )}
            
            {importState === "preview" && (
              <div className="w-full flex justify-center">
                <PreviewTable 
                  file={file!} 
                  onCancel={handleCancel} 
                  onConfirm={handleConfirm} 
                  submitError={submitError} 
                />
              </div>
            )}

            {importState === "processing" && (
              <div className="w-full flex justify-center">
                <ProcessingState stage={processingStage} />
              </div>
            )}

            {importState === "result" && (
              <div className="w-full flex justify-center h-full">
                <ResultTable data={importResult} onReset={handleCancel} originalFilename={file?.name || "export.csv"} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
