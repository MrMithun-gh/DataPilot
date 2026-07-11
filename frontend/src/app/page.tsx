"use client";

import { useState } from "react";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PreviewTable } from "@/components/PreviewTable";
import { FileUp } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleCancel = () => {
    setFile(null);
  };

  const handleConfirm = () => {
    alert("Import confirmed (backend call skipped based on instructions).");
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-sans bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-[#2d2d30] shrink-0 flex flex-col bg-[#1c1c1f] md:min-h-screen z-20 shadow-xl">
        <div className="flex items-center gap-3 mb-8 px-6 pt-7">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-[15px] shadow-sm">D</div>
          <div>
            <h1 className="text-white text-[16px] font-bold leading-tight tracking-wide">DataPilot</h1>
            <p className="text-muted text-[13px] font-medium mt-0.5">AI CRM Import</p>
          </div>
        </div>
        
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible px-4 pb-4 md:pb-0" aria-label="Sidebar Navigation">
          <button 
            className="w-full text-left px-4 py-2.5 text-[14px] text-white bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 relative md:before:content-[''] md:before:absolute md:before:-left-4 md:before:w-1 md:before:h-6 md:before:bg-primary md:before:rounded-r-full font-semibold transition-colors shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-current="page"
          >
            <FileUp size={18} strokeWidth={2.5} className="text-[#c3c0ff]" />
            New Import
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 relative flex flex-col min-h-screen overflow-hidden bg-[#fafafa]">
        {/* Header */}
        <header className="h-16 border-b border-border bg-white flex items-center px-8 shrink-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2.5 text-[14px] text-muted font-medium">
              <li>
                <button className="hover:text-on-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">Workspace</button>
              </li>
              <li aria-hidden="true" className="text-border">/</li>
              <li>
                <span className="text-on-background font-semibold" aria-current="page">New Import</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative p-6 md:p-12 flex flex-col items-center">
          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[500px]">
            {!file ? (
              <div className="w-full flex justify-center">
                <UploadDropzone onUpload={handleUpload} onCancel={handleCancel} />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <PreviewTable file={file} onCancel={handleCancel} onConfirm={handleConfirm} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
