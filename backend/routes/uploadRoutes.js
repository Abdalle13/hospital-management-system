import express from 'express';
import ImageKit from 'imagekit';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/imagekit-auth', protect, (req, res) => {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
  } catch (error) {
    res.status(500).json({ message: 'ImageKit configuration missing or invalid' });
  }
});

export default router;
