import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Proxies a file to ImageKit using only the private key — the browser sends
// the file to us as base64, we forward it server-side via Basic Auth, and
// hand back the resulting URL. No ImageKit credentials ever reach the client.
router.post('/file', protect, uploadLimiter, async (req, res) => {
  try {
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      return res.status(500).json({ message: 'File uploads are not configured yet' });
    }

    const { file, fileName } = req.body;
    if (!file || !fileName) {
      return res.status(400).json({ message: 'file and fileName are required' });
    }

    const base64 = file.includes(',') ? file.split(',')[1] : file;

    const form = new FormData();
    form.append('file', base64);
    form.append('fileName', fileName);
    form.append('useUniqueFileName', 'true');

    const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
    const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}` },
      body: form,
    });

    const data = await ikRes.json();
    if (!ikRes.ok) {
      return res.status(ikRes.status).json({ message: data.message || 'Upload failed' });
    }

    res.json({ url: data.url, name: data.name, fileId: data.fileId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
