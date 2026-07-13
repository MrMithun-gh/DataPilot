# DataPilot

DataPilot is an AI-powered CSV-to-CRM import tool that leverages OpenAI structured outputs to map inconsistent, messy CSV headers and data into a strict CRM data model automatically.

## Features
- **AI Extraction Pipeline**: Uses GPT-4o-mini with structured outputs for perfect schema enforcement and intelligent column mapping.
- **Client-Side Validation**: Ensures uploaded files meet the strict 5MB limit before hitting the backend.
- **Polished UI**: Modern, responsive interface built with Next.js, Tailwind v4, and Lucide Icons, mimicking production-grade enterprise software.
- **Resilient Batch Processing**: AI extraction happens in controlled batches with built-in concurrency limits and automatic retry backoff.
- **Clear Result Reporting**: Easily review Successfully Imported vs Skipped rows, complete with backend rejection reasons and raw JSON payloads.
- **UI Enhancements**: Includes a Dark/Light theme toggle and local storage-based Import History.
- **CSV Export**: Users can download successfully imported and mapped records directly as a clean CSV.
- **Code-Level Deterministic Safety**: Complements AI extraction with deterministic country code inference and strict regex-based data hygiene.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS v4, PapaParse
- **Backend**: Node.js, Express, TypeScript, Multer, OpenAI SDK, Zod
- **Infrastructure**: Configured for deployment on Vercel (Frontend) and Railway/Render (Backend).

## Folder Structure
```
DataPilot/
├── backend/          # Express API server handling CSV parsing, AI extraction, and validation
├── frontend/         # Next.js React application
└── docs/             # Requirements and Architecture documentation
```

## Installation

### Prerequisites
- Node.js (v20+)
- npm
- OpenAI API Key

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy the environment variables template: `cp .env.example .env`
4. Fill in `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ALLOWED_ORIGIN=http://localhost:3000
   ```

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Copy the environment variables template: `cp .env.local.example .env.local`
4. Fill in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Running the Application

**Run Backend (Development)**
```bash
cd backend
npm run dev
```

**Run Frontend (Development)**
```bash
cd frontend
npm run dev
```
Access the application at `http://localhost:3000`.

## AI Extraction Workflow
1. User uploads a `.csv` file via the UI.
2. The UI parses the file client-side using `PapaParse` to display a raw preview.
3. Upon confirmation, the original file is sent to `POST /api/import` as `multipart/form-data`.
4. The backend streams the CSV, splits it into batches, and maps rows using OpenAI's structured outputs against the strict CRM schema.
5. Post-validation using Zod cleans up any enum mismatches before returning the final report.

## Deployment Instructions

### Deploying the Backend (Railway, Render, or similar Node.js host)
1. Connect your GitHub repository to your hosting provider.
2. Set the root directory to `backend`.
3. The build command is `npm run build`.
4. The start command is `npm run start` (which executes `node dist/index.js`).
5. Configure the following Environment Variables in the provider dashboard:
   - `OPENAI_API_KEY`: Your OpenAI key.
   - `PORT`: (Usually provided automatically by the host, e.g., 8080).
   - `ALLOWED_ORIGIN`: The production URL of your frontend (e.g., `https://datapilot-frontend.vercel.app`).
6. Deploy the service.
7. Verify deployment by visiting `https://your-backend-url.com/health` to see `{"status":"ok"}`.

### Deploying the Frontend (Vercel)
1. Import your GitHub repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Vercel will automatically detect the Next.js framework and set the correct build settings.
4. Configure the following Environment Variable:
   - `NEXT_PUBLIC_API_URL`: The production URL of your deployed backend (e.g., `https://your-backend-url.com`).
5. Deploy.
