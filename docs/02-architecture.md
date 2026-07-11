# Architecture

## Two-App Topology
The system consists of two independently deployed applications:
- **Frontend:** Built with Next.js (App Router) + TypeScript, and deployed to Vercel.
- **Backend:** Built with Node.js + Express + TypeScript, and deployed to Railway or Render.

## Backend Hosting Rationale
The backend is explicitly deployed to platforms like **Railway** or **Render** rather than as a serverless function (e.g., on Vercel or AWS Lambda). 
**Why?** The backend acts as a long-running server process. A CSV import can trigger many sequential or parallel AI batch calls. A serverless function has a strict execution timeout limit. A multi-batch import for a large CSV could easily exceed this timeout, causing the request to be silently killed mid-import with no result. A long-running server process has no such limits for a synchronous request, allowing us to keep the architecture simple (avoiding complex async job queues or polling) while safely processing large files.

## Data Flow Pipeline
Below is the journey of a single CSV row through the system:

```text
Upload
    ↓
Client-side parse (PapaParse)
    ↓
User clicks Confirm
    ↓
POST multipart/form-data to backend
    ↓
Backend parses CSV into raw row objects
    ↓
Rows split into batches
    ↓
Batches sent to OpenAI in parallel (with concurrency cap)
    ↓
AI returns structured JSON
    ↓
Zod validation
    ↓
Skip rule applied
    ↓
Response assembled
    ↓
Frontend renders imported/skipped results
```

## Tech Stack

| Layer | Technology | Reason |
| --- | --- | --- |
| **Frontend Framework** | Next.js + TypeScript | Required by the assignment for a modern React architecture. |
| **Frontend Styling** | Tailwind CSS | Fast, utility-first styling that matches the design tokens. |
| **Client CSV Parsing** | PapaParse | Allows fast preview of CSVs entirely client-side without backend round-trips. |
| **Backend Framework** | Express + TypeScript | Required by the assignment for a standard Node.js API server. |
| **File Upload Handling** | multer | Middleware that enforces file type and size limits at the edge. |
| **Server CSV Parsing** | csv-parser | Efficiently converts the uploaded file buffer into raw row objects. |
| **AI Provider** | OpenAI SDK (Structured Outputs) | Provides fast and reliable extraction with guaranteed JSON shapes. |
| **Post-AI Validation** | Zod | Code-level enforcement of enum rules, formats, and skip logic independent of the model's output. |
