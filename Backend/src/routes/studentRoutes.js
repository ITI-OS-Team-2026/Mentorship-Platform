import express from 'express';
import { getMentors, getMentorDetails, getReviewEligibility, createReview, bookSession, getStudentSessions, cancelSession, rescheduleSession } from '../controllers/studentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mentors', getMentors);
router.get('/mentors/:id/review-eligibility', protect, authorizeRoles('Student'), getReviewEligibility);
router.post('/mentors/:id/reviews', protect, authorizeRoles('Student'), createReview);
router.get('/mentors/:id', getMentorDetails);
router.post('/sessions', protect, authorizeRoles('Student'), bookSession);
router.get('/sessions', protect, authorizeRoles('Student'), getStudentSessions);
router.put('/sessions/:id/cancel', protect, authorizeRoles('Student'), cancelSession);
router.put('/sessions/:id/reschedule', protect, authorizeRoles('Student'), rescheduleSession);

export default router;
