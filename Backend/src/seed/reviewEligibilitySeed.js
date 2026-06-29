import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Stack from '../models/Stack.js';
import MentorProfile from '../models/MentorProfile.js';
import MentorAvailability from '../models/MentorAvailability.js';
import Session from '../models/Session.js';
import Review from '../models/Review.js';

dotenv.config();

const PASSWORD = 'Password123!';

const scenario = {
  mentor: {
    name: 'Review Test Mentor',
    email: 'review.mentor@example.com',
    title: 'Senior Mentorship Reviewer'
  },
  eligibleStudent: {
    name: 'Eligible Review Student',
    email: 'review.eligible.student@example.com'
  },
  ineligibleStudent: {
    name: 'Ineligible Review Student',
    email: 'review.ineligible.student@example.com'
  }
};

const upsertUser = async ({ name, email }, role) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      password_hash: PASSWORD,
      role,
      status: 'approved'
    });
    return user;
  }

  user.name = name;
  user.password_hash = PASSWORD;
  user.role = role;
  user.status = 'approved';
  await user.save();
  return user;
};

const seedReviewEligibility = async () => {
  await connectDB();

  const stack = await Stack.findOneAndUpdate(
    { name: 'Review Eligibility QA' },
    {
      name: 'Review Eligibility QA',
      description: 'Seed stack for review eligibility testing'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  const mentorUser = await upsertUser(scenario.mentor, 'Mentor');
  const eligibleStudent = await upsertUser(scenario.eligibleStudent, 'Student');
  const ineligibleStudent = await upsertUser(scenario.ineligibleStudent, 'Student');

  const mentorProfile = await MentorProfile.findOneAndUpdate(
    { user_id: mentorUser._id },
    {
      user_id: mentorUser._id,
      stack_id: stack._id,
      name: scenario.mentor.name,
      title: scenario.mentor.title,
      bio: 'Seed mentor used to verify review eligibility rules.',
      is_verified: true,
      average_rating: 0,
      hourly_rate: 80
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true }
  );

  await MentorAvailability.findOneAndUpdate(
    {
      mentor_id: mentorProfile._id,
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '12:00'
    },
    {
      mentor_id: mentorProfile._id,
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '12:00'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  await Session.findOneAndUpdate(
    {
      mentor_id: mentorProfile._id,
      student_id: eligibleStudent._id,
      scheduled_date: new Date('2026-06-01T00:00:00.000Z'),
      start_time: '09:00',
      end_time: '09:45'
    },
    {
      mentor_id: mentorProfile._id,
      student_id: eligibleStudent._id,
      scheduled_date: new Date('2026-06-01T00:00:00.000Z'),
      start_time: '09:00',
      end_time: '09:45',
      status: 'completed',
      submission_description: 'Completed seed session for the eligible review scenario.',
      mentor_notes: 'Seed session marked complete.'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true }
  );

  await Session.deleteMany({
    mentor_id: mentorProfile._id,
    student_id: ineligibleStudent._id
  });

  await Review.deleteMany({
    mentor_id: mentorProfile._id,
    student_id: { $in: [eligibleStudent._id, ineligibleStudent._id] }
  });

  mentorProfile.average_rating = 0;
  await mentorProfile.save();

  console.log('Review eligibility seed complete.');
  console.log('');
  console.log('Scenario 1 - eligible');
  console.log(`Student: ${scenario.eligibleStudent.email}`);
  console.log(`Password: ${PASSWORD}`);
  console.log('Expected: can submit one review for Review Test Mentor.');
  console.log('');
  console.log('Scenario 2 - not eligible');
  console.log(`Student: ${scenario.ineligibleStudent.email}`);
  console.log(`Password: ${PASSWORD}`);
  console.log('Expected: cannot see review action and API returns 403.');
  console.log('');
  console.log('Mentor profile URL id');
  console.log(mentorUser._id.toString());
};

seedReviewEligibility()
  .catch((error) => {
    console.error('Review eligibility seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
