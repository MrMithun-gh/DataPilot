import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') });

import { extractBatch } from './src/services/aiService';

async function runTest() {
  const testRows = [
    { "Source": "eden_park", "Name": "Alice Match" },
    { "Source": "Google Ads", "Name": "Bob Mismatch" }
  ];

  console.log("Starting extraction...");
  try {
    const results = await extractBatch(testRows);
    console.log("FULL RECORDS:");
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
