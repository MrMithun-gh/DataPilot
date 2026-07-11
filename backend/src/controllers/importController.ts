import { Request, Response } from 'express';
import csv from 'csv-parser';
import { Readable } from 'stream';

export const handleImport = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results: any[] = [];
    
    // Convert buffer to stream
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length === 0) {
          return res.status(400).json({ error: 'Empty or unparseable CSV' });
        }

        res.status(200).json({
          totalRows: results.length,
          rows: results
        });
      })
      .on('error', (err) => {
        res.status(400).json({ error: 'Empty or unparseable CSV' });
      });
  } catch (error) {
    console.error('Import Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
