import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';


const ensureDirExists = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

ensureDirExists(TEMP_UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, TEMP_UPLOAD_DIR);
    } catch (error) {
      console.error('Error setting destination:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed.'));
  }
});

export { upload };
