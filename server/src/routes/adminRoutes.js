import express from 'express';
import { adminLogin, adminVerify } from '../controllers/adminController.js';

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.get('/verify', adminVerify);

export default router;
