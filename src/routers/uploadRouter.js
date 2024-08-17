import express from 'express';
import { upload } from '../middlewares/multerConfig.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

export default uploadRouter;