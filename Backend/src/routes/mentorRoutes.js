import express from 'express';
import { getMentorProfile } from '../controllers/mentorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, authorizeRoles('Mentor'), getMentorProfile);

export default router;
