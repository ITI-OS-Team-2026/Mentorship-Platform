import MentorProfile from '../models/MentorProfile.js';

export const getMentorProfile = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({ user_id: req.user._id })
      .populate('stack_id');

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    res.json({
      success: true,
      mentor: {
        id: mentorProfile._id,
        name: mentorProfile.name,
        title: mentorProfile.title,
        bio: mentorProfile.bio,
        is_verified: mentorProfile.is_verified,
        average_rating: mentorProfile.average_rating,
        hourly_rate: mentorProfile.hourly_rate,
        stack: mentorProfile.stack_id
      }
    });
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
