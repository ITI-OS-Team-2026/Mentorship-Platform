import express from 'express';
import { getMentorProfile, updateMentorProfile } from '../controllers/mentorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, authorizeRoles('Mentor'), getMentorProfile);
router.put('/profile', protect, authorizeRoles('Mentor'), updateMentorProfile);

export default router;
