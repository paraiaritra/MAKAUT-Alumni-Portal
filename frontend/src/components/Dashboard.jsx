import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink, ArrowRight, Heart, Shield, Phone, Mail, Crown, BookOpen, Target, Compass, Award, Send } from 'lucide-react';
import EditProfileModal from './EditProfileModal'; 
import AdminAuth from './AdminAuth';
import DonateModal from './DonateModal'; 
import { contactAPI } from '../services/api'; // Import contact API

const Dashboard = ({ eventsAPI, jobsAPI, alumniAPI, user, setActiveTab, onLoginClick }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error

  const refreshData = () => { console.log("Profile updated"); };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventsRes = await eventsAPI.getAllEvents();
      if (eventsRes?.data) {
        const sorted = eventsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingEvents(sorted.slice(0, 3));
      }
    } catch (error) { console.error('Error fetching data:', error); } 
    finally { setLoading(false); }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      // Send to backend (Admin Portal)
      await contactAPI.sendMessage(contactForm);
      setFormStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  // Static Data
  const placedStudents = [
    { name: "Pravin Pandey", company: "Google", role: "Senior Software Engineer", image: "https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702803/WhatsApp_Image_2025-12-03_at_00.42.37_aefca4ab_hyyaox.jpg" },
    { name: "Anupam Yadav", company: "Microsoft", role: "Product Manager", image: "https://res.cloudinary.com/dyo7pelfy/image/upload/v1764701602/Screenshot_2025-12-03_002257_fd5lik.png" },
    { name: "Sumon Khan", company: "Amazon", role: "Cloud Architect", image: "https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702802/WhatsApp_Image_2025-12-03_at_00.42.36_802a130e_eoq2fr.jpg" }
  ];

  const galleryImages = [
    "https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702282/IMG-20251203-WA0015_dmf5jt.jpg",
    "https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702282/IMG-20251203-WA0017_veqgxx.jpg",
    "https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702281/IMG-20251203-WA0014_rw193d.jpg"
  ];

  // Professional Section Data with Images
  const visionCards = [
    { 
      title: "Our Mission", 
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600",
      icon: <Target size={24} className="text-white" />, 
      desc: "To provide high-quality education and research opportunities that contribute to national development and global recognition.",
      color: "from-red-500 to-pink-600"
    },
    { 
      title: "Our Plan", 
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
      icon: <Compass size={24} className="text-white" />, 
      desc: "Expanding digital infrastructure and building a strong global alumni network to bridge the gap between industry and academia.",
      color: "from-green-500 to-teal-600"
    },
    { 
      title: "Our Goals", 
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
      icon: <Award size={24} className="text-white" />, 
      desc: "To become a hub of innovation and entrepreneurship, empowering students to become leaders in their respective fields.",
      color: "from-purple-500 to-indigo-600"
    }
  ];

  return (
    <div className="font-sans text-gray-800 space-y-12">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: 'url("https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702811/main_pic_makaut_nfnrzv.jpg")' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Maulana Abul Kalam Azad University of Technology
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
              Empowering minds, shaping futures, and building a global community of innovators and leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <button onClick={onLoginClick} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  Get Started <ArrowRight size={20} />
                </button>
              ) : (
                <button onClick={() => setActiveTab('profile')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  My Profile <ArrowRight size={20} />
                </button>
              )}
              <a href="https://makautwb.ac.in" target="_blank" rel="noreferrer" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2">
                Our College <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROFESSIONAL ABOUT SECTION */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100 flex flex-col lg:flex-row items-center gap-10 overflow-hidden">
        <div className="lg:w-1/2 relative group">
          <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
          <img 
            src="https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702811/main_pic_makaut_nfnrzv.jpg" 
            alt="MAKAUT Campus" 
            className="rounded-2xl shadow-lg relative z-10 w-full h-[300px] object-cover transform transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="lg:w-1/2 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-semibold text-xs">
            <BookOpen size={14} /> About Our University
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            A Legacy of Excellence in <span className="text-blue-600">Technology & Innovation</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Maulana Abul Kalam Azad University of Technology (MAKAUT), West Bengal (formerly known as West Bengal University of Technology), began its journey in 2001. It is a state university providing high-quality education in technology and management.
          </p>
          <p className="text-base text-gray-600 leading-relaxed">
            Our alumni network is a testament to our commitment to excellence, with graduates leading in top global corporations, research institutions, and entrepreneurial ventures.
          </p>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all mt-2 text-sm">
            Read More About Us <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 3. MISSION, PLAN, GOALS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visionCards.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="h-40 overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-80 z-10`}></div>
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ADMIN LOGIN BUTTON */}
      {!user && (
        <div className="fixed bottom-6 right-6 z-40">
          <button onClick={() => setShowAdminLogin(true)} className="bg-slate-900 text-white p-3 rounded-full shadow-xl hover:bg-black border border-slate-700 flex items-center gap-2 font-bold pr-5 transition-transform hover:scale-105 group text-sm">
            <div className="bg-red-500 p-1.5 rounded-full group-hover:animate-pulse">
              <Shield size={14} className="text-white" /> 
            </div>
            Admin Portal
          </button>
        </div>
      )}

      {/* 4. DONATE & MEMBERSHIP GRID */}
      {user && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <Heart size={28} className="text-white fill-current" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Support Your Alma Mater</h2>
              <p className="text-pink-100 mb-6 text-base">Your contribution helps us organize better events and provide scholarships to deserving students.</p>
              <button onClick={() => setShowDonateModal(true)} className="bg-white text-pink-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-pink-50 transition-colors text-sm">
                Donate Now
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <Crown size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Premium Membership</h2>
              <p className="text-orange-100 mb-6 text-base">Get exclusive access to premium job listings, priority event registration, and networking.</p>
              <button onClick={() => setActiveTab('membership')} className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-50 transition-colors text-sm">
                {user?.membershipStatus === 'premium' ? 'View Benefits' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. UPCOMING EVENTS */}
      <div>
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 mt-1 text-sm">Join us in our upcoming seminars and meetups</p>
          </div>
          <button onClick={() => setActiveTab('events')} className="text-blue-600 font-bold hover:text-blue-800 hidden sm:flex items-center gap-2 text-sm">
            View All Events <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all group cursor-pointer">
                <div className="h-40 bg-slate-900 relative p-6 flex flex-col justify-center items-center text-white group-hover:bg-blue-900 transition-colors">
                  <span className="text-4xl mb-2">📅</span>
                  <span className="font-bold text-xl">{new Date(event.date).toDateString()}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center text-gray-500 text-xs gap-2">
                    <MapPin size={14} /> {event.location || 'Online'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium text-sm">No upcoming events scheduled at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. PLACED STUDENTS */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 relative z-10">Our Alumni Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {placedStudents.map((student, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 p-1 border-2 border-orange-500">
                <img src={student.image} alt={student.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">{student.name}</h3>
              <p className="text-orange-400 font-medium mb-3 text-sm">{student.role}</p>
              <div className="inline-block bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold tracking-wide">{student.company}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. EVENT GALLERY */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Campus Moments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div key={idx} className={`relative group overflow-hidden rounded-2xl cursor-pointer ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" style={{ minHeight: idx === 0 ? '300px' : '150px' }} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold tracking-wider border-2 border-white px-4 py-1.5 rounded-full text-sm">VIEW</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. NEW CONTACT FORM SECTION */}
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Contact Info */}
        <div className="bg-indigo-50 rounded-3xl p-6 md:p-10 border border-indigo-100 h-full">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Get in Touch</h2>
          <p className="text-indigo-600 mb-8 text-base">Have questions? Reach out to the Alumni Association directly.</p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-500 shrink-0"><MapPin size={20} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Our Address</h3>
                <p className="text-gray-600 text-sm">City Office: BF-142, Sector-I, Saltlake City, Kolkata-64</p>
                <p className="text-gray-600 mt-1 text-sm">Main Office: NH12, Simhat, Nadia, West Bengal, 741249</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500 shrink-0"><Mail size={20} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Email Us</h3>
                <p className="text-gray-600 text-sm">makautwb.alumni@gmail.com</p>
                <p className="text-xs text-gray-500 mt-1">Response time: 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-500 shrink-0"><Phone size={20} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Call Us</h3>
                <p className="text-gray-600 font-bold text-lg">033 2589 1555</p>
                <p className="text-sm text-gray-500 mt-1">Mon - Fri, 9am - 5pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Your Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Your Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="john@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Subject</label>
              <input 
                required
                type="text" 
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                placeholder="Regarding Alumni Event..."
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Message</label>
              <textarea 
                required
                rows="3"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                placeholder="Type your message here..."
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              disabled={formStatus === 'sending'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
            >
              {formStatus === 'sending' ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>
            {formStatus === 'success' && (
              <p className="text-green-600 text-center font-medium bg-green-50 p-2 rounded-lg text-sm">Message sent successfully!</p>
            )}
            {formStatus === 'error' && (
              <p className="text-red-600 text-center font-medium bg-red-50 p-2 rounded-lg text-sm">Failed to send. Please try again.</p>
            )}
          </form>
        </div>
      </div>

      {/* MODALS */}
      {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onUpdateSuccess={refreshData} />}
      {showAdminLogin && <AdminAuth onClose={() => setShowAdminLogin(false)} />}
      {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
    </div>
  );
};

export default Dashboard;