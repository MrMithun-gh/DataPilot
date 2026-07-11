import multer from 'multer';
import { Request } from 'express';

// Accept CSV files only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    // Note: multer by itself doesn't easily return a custom res.status(400) directly from here,
    // we return an error which we will catch in the route.
    cb(new Error('INVALID_TYPE'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // keeping it in memory for csv-parser
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter
});

// We wrap the upload.single to catch Multer errors and return 400
export const uploadMiddleware = (req: any, res: any, next: any) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, (err: any) => {
    if (err) {
      if (err.message === 'INVALID_TYPE') {
        return res.status(400).json({ error: 'Invalid file type. Only .csv files are accepted.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds the 5 MB limit.' });
      }
      return res.status(400).json({ error: err.message || 'Error uploading file.' });
    }
    
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    next();
  });
};
