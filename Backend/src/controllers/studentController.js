import mongoose from 'mongoose';
import MentorProfile from '../models/MentorProfile.js';
import MentorAvailability from '../models/MentorAvailability.js';
import Session from '../models/Session.js';
import Review from '../models/Review.js';

const buildReviewEligibility = async (mentorId, studentId) => {
  const [completedSession, existingReview] = await Promise.all([
    Session.findOne({
      mentor_id: mentorId,
      student_id: studentId,
      status: 'completed'
    }).select('_id'),
    Review.findOne({
      mentor_id: mentorId,
      student_id: studentId
    }).select('_id rating comment createdAt')
  ]);

  let reason = null;
  if (!completedSession) {
    reason = 'A completed mentorship session with this mentor is required before reviewing.';
  } else if (existingReview) {
    reason = 'You have already reviewed this mentor.';
  }

  return {
    eligible: Boolean(completedSession && !existingReview),
    has_completed_session: Boolean(completedSession),
    has_existing_review: Boolean(existingReview),
    reason,
    existing_review: existingReview || null
  };
};

const recalculateMentorRating = async (mentorId) => {
  const [stats] = await Review.aggregate([
    { $match: { mentor_id: new mongoose.Types.ObjectId(mentorId) } },
    {
      $group: {
        _id: '$mentor_id',
        average_rating: { $avg: '$rating' },
        review_count: { $sum: 1 }
      }
    }
  ]);

  const averageRating = stats ? Number(stats.average_rating.toFixed(1)) : 0;
  const reviewCount = stats?.review_count || 0;

  await MentorProfile.findByIdAndUpdate(mentorId, { average_rating: averageRating });

  return { average_rating: averageRating, review_count: reviewCount };
};

export const getMentors = async (req, res) => {
  try {
    const { stack, search, sort_by = 'rating', page = 1, limit = 10 } = req.query;
    let query = {}; // Temporarily removed is_verified requirement for local testing

    if (stack) {
      query.stack_id = stack;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const sortConfig = {};
    if (sort_by === 'rating') sortConfig.average_rating = -1;
    else if (sort_by === 'price_low') sortConfig.hourly_rate = 1;
    else if (sort_by === 'price_high') sortConfig.hourly_rate = -1;
    else sortConfig.average_rating = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mentors = await MentorProfile.find(query)
      .populate('stack_id', 'name')
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MentorProfile.countDocuments(query);

    res.json({
      mentors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMentorDetails = async (req, res) => {
  try {
    const mentor = await MentorProfile.findOne({ user_id: req.params.id }).populate('stack_id', 'name');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    
    const [availability, reviews, reviewCount] = await Promise.all([
      MentorAvailability.find({ mentor_id: mentor._id }),
      Review.find({ mentor_id: mentor._id })
        .populate('student_id', 'name')
        .sort({ createdAt: -1 }),
      Review.countDocuments({ mentor_id: mentor._id })
    ]);

    res.json({
      mentor: {
        ...mentor.toObject(),
        review_count: reviewCount
      },
      availability,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getReviewEligibility = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid mentor id.' });
    }

    const mentor = await MentorProfile.findOne({ user_id: req.params.id });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const eligibility = await buildReviewEligibility(mentor._id, req.user._id);

    res.json({
      mentor_id: mentor._id,
      ...eligibility
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid mentor id.' });
    }

    const mentor = await MentorProfile.findOne({ user_id: req.params.id });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const rating = Number(req.body.rating);
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be a whole number from 1 to 5.' });
    }

    if (!comment) {
      return res.status(400).json({ message: 'comment is required.' });
    }

    if (comment.length > 1000) {
      return res.status(400).json({ message: 'comment must be 1000 characters or fewer.' });
    }

    const eligibility = await buildReviewEligibility(mentor._id, req.user._id);

    if (eligibility.has_existing_review) {
      return res.status(409).json({ message: 'You have already reviewed this mentor.' });
    }

    if (!eligibility.has_completed_session) {
      return res.status(403).json({ message: 'You must complete a mentorship session with this mentor before reviewing.' });
    }

    let review;
    try {
      review = await Review.create({
        mentor_id: mentor._id,
        student_id: req.user._id,
        rating,
        comment
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'You have already reviewed this mentor.' });
      }
      throw error;
    }

    await review.populate('student_id', 'name');
    const stats = await recalculateMentorRating(mentor._id);

    res.status(201).json({
      review,
      mentor: {
        id: mentor._id,
        user_id: mentor.user_id,
        ...stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const bookSession = async (req, res) => {
  try {
    const { mentor_id, scheduled_date, start_time, end_time, submission_description } = req.body;
    const student_id = req.user.id;

    if (!mentor_id || !mongoose.Types.ObjectId.isValid(mentor_id)) {
      return res.status(400).json({ message: 'Invalid mentor_id.' });
    }

    const dateObj = new Date(scheduled_date);
    if (isNaN(dateObj)) {
      return res.status(400).json({ message: 'Invalid scheduled_date.' });
    }

    // Helper to convert HH:MM to minutes for safe comparison
    const timeToMinutes = (timeStr) => {
      if (!timeStr || !timeStr.includes(':')) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const requestedStart = timeToMinutes(start_time);
    const requestedEnd = timeToMinutes(end_time);

    if (requestedEnd <= requestedStart) {
      return res.status(400).json({ message: 'end_time must be after start_time.' });
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[dateObj.getUTCDay()];

    // Get mentor availability for the requested day
    const availabilities = await MentorAvailability.find({
      mentor_id,
      day_of_week: dayOfWeek
    });

    if (availabilities.length === 0) {
      return res.status(400).json({ message: `Mentor is not available on ${dayOfWeek}s.` });
    }

    // Check if requested time falls fully within any of the slots
    const isWithinSlot = availabilities.some(slot => {
      const slotStart = timeToMinutes(slot.start_time);
      const slotEnd = timeToMinutes(slot.end_time);
      return requestedStart >= slotStart && requestedEnd <= slotEnd;
    });

    if (!isWithinSlot) {
      return res.status(400).json({ message: 'Requested time is outside the mentor\'s availability slots.' });
    }

    // Check overlap
    const overlappingSession = await Session.findOne({
      mentor_id,
      scheduled_date: new Date(scheduled_date),
      status: { $in: ['scheduled', 'completed'] },
      $or: [
        { start_time: { $lt: end_time }, end_time: { $gt: start_time } }
      ]
    });

    if (overlappingSession) {
      return res.status(409).json({ message: 'Time slot is no longer available.' });
    }

    const newSession = await Session.create({
      mentor_id,
      student_id,
      scheduled_date: new Date(scheduled_date),
      start_time,
      end_time,
      submission_description
    });

    res.status(201).json({ session: newSession });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStudentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ student_id: req.user.id })
      .populate('mentor_id', 'name email title average_rating hourly_rate user_id')
      .sort({ scheduled_date: -1, start_time: -1 })
      .lean();

    const mentorIds = sessions
      .map(session => session.mentor_id?._id)
      .filter(Boolean);

    const existingReviews = await Review.find({
      student_id: req.user.id,
      mentor_id: { $in: mentorIds }
    }).select('mentor_id');

    const reviewedMentorIds = new Set(existingReviews.map(review => review.mentor_id.toString()));

    res.json(sessions.map(session => ({
      ...session,
      can_review: Boolean(
        session.status === 'completed' &&
        session.mentor_id?._id &&
        !reviewedMentorIds.has(session.mentor_id._id.toString())
      )
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, student_id: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    
    session.status = 'canceled';
    await session.save();
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rescheduleSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { scheduled_date, start_time, end_time } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: 'Invalid session id.' });
    }

    const session = await Session.findOne({ _id: sessionId, student_id: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status !== 'scheduled') return res.status(400).json({ message: 'Only scheduled sessions can be rescheduled.' });

    // validate date
    const dateObj = new Date(scheduled_date);
    if (isNaN(dateObj)) return res.status(400).json({ message: 'Invalid scheduled_date.' });

    // helper
    const timeToMinutes = (timeStr) => {
      if (!timeStr || !timeStr.includes(':')) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const requestedStart = timeToMinutes(start_time);
    const requestedEnd = timeToMinutes(end_time);

    if (requestedEnd <= requestedStart) return res.status(400).json({ message: 'end_time must be after start_time.' });

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayOfWeek = days[dateObj.getUTCDay()];

    // Check mentor availability for that day
    const availabilities = await MentorAvailability.find({ mentor_id: session.mentor_id, day_of_week: dayOfWeek });
    if (availabilities.length === 0) return res.status(400).json({ message: `Mentor is not available on ${dayOfWeek}s.` });

    const isWithinSlot = availabilities.some(slot => {
      const slotStart = timeToMinutes(slot.start_time);
      const slotEnd = timeToMinutes(slot.end_time);
      return requestedStart >= slotStart && requestedEnd <= slotEnd;
    });

    if (!isWithinSlot) return res.status(400).json({ message: 'Requested time is outside the mentor\'s availability slots.' });

    // Check overlapping sessions for mentor excluding current session
    const overlapping = await Session.findOne({
      mentor_id: session.mentor_id,
      scheduled_date: new Date(scheduled_date),
      status: { $in: ['scheduled', 'completed'] },
      _id: { $ne: session._id },
      $or: [ { start_time: { $lt: end_time }, end_time: { $gt: start_time } } ]
    });

    if (overlapping) return res.status(409).json({ message: 'Time slot is no longer available.' });

    // All good — update session atomically
    session.scheduled_date = new Date(scheduled_date);
    session.start_time = start_time;
    session.end_time = end_time;
    await session.save();

    // Return the updated session populated like getStudentSessions
    const updated = await Session.findById(session._id)
      .populate('mentor_id', 'name email title average_rating hourly_rate user_id')
      .lean();

    // determine can_review similar to getStudentSessions
    const existingReview = await Review.findOne({ student_id: req.user.id, mentor_id: updated.mentor_id?._id }).select('mentor_id');
    const can_review = Boolean(updated.status === 'completed' && updated.mentor_id?._id && !existingReview);

    res.json({ session: { ...updated, can_review } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
