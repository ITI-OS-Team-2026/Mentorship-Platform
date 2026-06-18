import MentorProfile from '../models/MentorProfile.js';
import MentorAvailability from '../models/MentorAvailability.js';

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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMentorProfile = async (req, res) => {
  try {
    const { name, title, bio, hourly_rate, stack_id } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (hourly_rate !== undefined) updateData.hourly_rate = hourly_rate;
    if (stack_id !== undefined) updateData.stack_id = stack_id;

    const mentorProfile = await MentorProfile.findOneAndUpdate(
      { user_id: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('stack_id');

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
    console.error('Error updating mentor profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMentorAvailability = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({ user_id: req.user._id });

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    const availability = await MentorAvailability.find({ mentor_id: mentorProfile._id })
      .sort({ day_of_week: 1, start_time: 1 });

    res.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Error fetching mentor availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createMentorAvailability = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;

    if (!day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'day_of_week, start_time, and end_time are required'
      });
    }

    if (end_time <= start_time) {
      return res.status(400).json({
        success: false,
        message: 'end_time must be greater than start_time'
      });
    }

    const mentorProfile = await MentorProfile.findOne({ user_id: req.user._id });

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    const existingSlots = await MentorAvailability.find({
      mentor_id: mentorProfile._id,
      day_of_week
    });

    for (const slot of existingSlots) {
      if (start_time < slot.end_time && end_time > slot.start_time) {
        return res.status(400).json({
          success: false,
          message: 'Availability slot overlaps with an existing slot'
        });
      }
    }

    const availability = await MentorAvailability.create({
      mentor_id: mentorProfile._id,
      day_of_week,
      start_time,
      end_time
    });

    res.status(201).json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Error creating mentor availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
