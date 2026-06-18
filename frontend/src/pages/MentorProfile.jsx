import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const token = user?.token;
  
  const [mentor, setMentor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/student/mentors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMentor(data.mentor);
          setAvailability(data.availability);
        } else {
          toast.error('Mentor not found');
          navigate('/mentors');
        }
      } catch (err) {
        toast.error('Failed to load mentor details');
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id, navigate]);

  const handleSlotClick = (slot) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = days.indexOf(slot.day_of_week);
    
    if (targetDay !== -1) {
      const today = new Date();
      const currentDay = today.getDay();
      
      let daysUntil = targetDay - currentDay;
      
      if (daysUntil < 0) {
        daysUntil += 7;
      } else if (daysUntil === 0) {
        const [hours, minutes] = slot.start_time.split(':').map(Number);
        if (today.getHours() > hours || (today.getHours() === hours && today.getMinutes() >= minutes)) {
          daysUntil += 7;
        }
      }
      
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntil);
      
      // Need local date string, ISOString uses UTC which might shift the date backwards by 1 day
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      
      setBookingDate(`${year}-${month}-${day}`);
      setBookingTime(slot.start_time);
      toast.success(`Selected upcoming ${slot.day_of_week}`);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to book a session');
      return navigate('/login');
    }
    if (user.role !== 'Student') {
      return toast.error('Only students can book sessions.');
    }
    if (!bookingDate || !bookingTime) {
      return toast.error('Please select date and time');
    }

    const start_time = bookingTime; // HH:MM
    // Compute end_time (+45 mins)
    const [hours, minutes] = start_time.split(':').map(Number);
    let dateObj = new Date(2000, 0, 1, hours, minutes);
    dateObj.setMinutes(dateObj.getMinutes() + 45);
    const end_time = dateObj.toTimeString().substring(0, 5); // HH:MM

    try {
      const res = await fetch(`http://localhost:5005/api/student/sessions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          mentor_id: mentor._id, // This is the MentorProfile ID
          scheduled_date: bookingDate,
          start_time,
          end_time,
          submission_description: description
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success('Session booked successfully!');
        navigate('/student/dashboard');
      } else {
        toast.error(data.message || 'Failed to book session');
      }
    } catch (err) {
      toast.error('Network error during booking');
    }
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading profile...</div>;
  if (!mentor) return null;

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-6xl flex flex-col lg:flex-row gap-8">
      {/* Left Column: Profile */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_rgba(129,140,248,0.1)_0%,_transparent_50%)] pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 uppercase tracking-tighter">{mentor.name}</h1>
          <p className="text-xl text-accent-primary mb-6 font-medium tracking-wide">{mentor.title}</p>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-yellow-400 font-bold flex items-center gap-1 bg-surface-base px-3 py-1 rounded-pill">
              ★ {mentor.average_rating.toFixed(1)}
            </span>
            <span className="text-primary bg-surface-base px-3 py-1 rounded-pill font-medium">${mentor.hourly_rate}/hr</span>
            {mentor.stack_id && <span className="bg-surface-hover px-3 py-1 rounded-pill text-sm text-muted-foreground border border-border-subtle">{mentor.stack_id.name}</span>}
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-white">About</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{mentor.bio || "This mentor hasn't added a bio yet."}</p>
        </div>

        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold mb-6">Availability Overview</h2>
          {availability.length === 0 ? (
            <p className="text-muted-foreground text-sm p-4 border border-dashed border-border-subtle rounded-lg text-center">This mentor has not set up their weekly schedule yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availability.map((slot, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSlotClick(slot)}
                  className="flex justify-between items-center p-4 bg-surface-base border border-border-subtle rounded-lg hover:bg-surface-hover hover:border-accent-primary transition-colors cursor-pointer"
                >
                  <span className="text-white font-medium">{slot.day_of_week}</span>
                  <span className="text-accent-primary text-sm font-mono bg-black/20 px-2 py-1 rounded">{slot.start_time} - {slot.end_time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Booking Form */}
      <div className="w-full lg:w-[400px]">
        <div className="glass-panel p-6 md:p-8 sticky top-24">
          <h2 className="text-2xl font-semibold mb-6 uppercase tracking-tight">Reserve Slot</h2>
          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">Select Date</label>
              <input 
                type="date" 
                required
                min={new Date().toISOString().split('T')[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">Start Time (HH:MM)</label>
              <input 
                type="time" 
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">Sessions are strictly isolated 45-minute code evaluations.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">Submission Context</label>
              <textarea 
                required
                rows={4}
                placeholder="What do you want to review? (e.g. async race condition in Node)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              ></textarea>
            </div>
            <button type="submit" className="w-full btn-primary py-4 text-base tracking-wide mt-4 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_30px_rgba(129,140,248,0.5)] transition-shadow">
              Secure 45-min Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;