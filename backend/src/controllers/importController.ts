import { Request, Response } from 'express';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { processCsvImport } from '../services/aiService';
import { validateAndFilterRecords } from '../services/validationService';

export const handleImport = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results: any[] = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        if (results.length === 0) {
          return res.status(400).json({ error: 'Empty or unparseable CSV' });
        }

        try {
          // Send all rows to the AI batch processor
          const batchResults = await processCsvImport(results);
          
          let importedCount = 0;
          let skippedCount = 0;
          const imported: any[] = [];
          const skipped: any[] = [];

          // Collate results
          batchResults.forEach(batch => {
            if (!batch.success || !batch.records) {
              // Batch completely failed (e.g. timeout, rate limit, AI error after retries)
              batch.originalRows.forEach(row => {
                skipped.push({ 
                  row, 
                  reason: batch.error || "AI extraction failed for this batch" 
                });
                skippedCount++;
              });
            } else {
              // Validate AI-extracted records with Zod and apply the skip rule
              const validationResult = validateAndFilterRecords(batch.records, batch.originalRows);
              
              imported.push(...validationResult.imported);
              importedCount += validationResult.imported.length;
              
              skipped.push(...validationResult.skipped);
              skippedCount += validationResult.skipped.length;
            }
          });

          res.status(200).json({
            totalRows: results.length,
            importedCount,
            skippedCount,
            imported,
            skipped
          });
        } catch (error: any) {
          console.error('Batch Processing Fatal Error:', error);
          res.status(502).json({ error: error.message || 'AI provider unreachable' });
        }
      })
      .on('error', (err) => {
        res.status(400).json({ error: 'Empty or unparseable CSV' });
      });
  } catch (error) {
    console.error('Import Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
