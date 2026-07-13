import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.join(__dirname, '.env') });

import { processCsvImport } from './src/services/aiService';
import Papa from 'papaparse';

async function runTest() {
  const csvStr = fs.readFileSync(path.join(__dirname, 'test-data', 'messy.csv'), 'utf8');
  
  const parsed = Papa.parse(csvStr, {
    header: true,
    skipEmptyLines: true,
  });

  try {
    const results = await processCsvImport(parsed.data);
    
    const imported = [];
    results.forEach(res => {
      if (res.success && res.records) {
        imported.push(...res.records);
      }
    });

    console.log(JSON.stringify(imported, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
