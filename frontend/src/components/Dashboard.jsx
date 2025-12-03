import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink, ArrowRight, Heart, Shield, Phone, Mail, Crown, BookOpen, Target, Compass, Award, Send } from 'lucide-react';
import EditProfileModal from './EditProfileModal'; 
import AdminAuth from './AdminAuth';
import DonateModal from './DonateModal'; 
import { contactAPI } from '../services/api'; 

const Dashboard = ({ eventsAPI, jobsAPI, alumniAPI, user, setActiveTab, onLoginClick }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); 

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
      // Send to backend (which emails paraibabuaritra@gmail.com)
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

  // Enhanced Section Data with Images
  const visionCards = [
    { 
      title: "Our Mission", 
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600", 
      icon: <Target size={28} className="text-white" />, 
      desc: "To provide high-quality education and research opportunities that contribute to national development and global recognition.",
      color: "from-red-600 to-red-800"
    },
    { 
      title: "Our Plan", 
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600", 
      icon: <Compass size={28} className="text-white" />, 
      desc: "Expanding digital infrastructure and building a strong global alumni network to bridge the gap between industry and academia.",
      color: "from-emerald-600 to-emerald-800"
    },
    { 
      title: "Our Goals", 
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600", 
      icon: <Award size={28} className="text-white" />, 
      desc: "To become a hub of innovation and entrepreneurship, empowering students to become leaders in their respective fields.",
      color: "from-indigo-600 to-indigo-800"
    }
  ];

  return (
    <div className="font-sans text-gray-800 space-y-24 pb-12">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: 'url("https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702811/main_pic_makaut_nfnrzv.jpg")' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 font-semibold text-sm mb-4 tracking-wider uppercase">
              Official Alumni Association
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
              Maulana Abul Kalam Azad <br/> University of Technology
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Empowering minds, shaping futures, and building a global community of innovators and leaders since 2001.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              {!user ? (
                <button onClick={onLoginClick} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  Get Started <ArrowRight size={22} />
                </button>
              ) : (
                <button onClick={() => setActiveTab('profile')} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  My Profile <ArrowRight size={22} />
                </button>
              )}
              <a href="https://makautwb.ac.in" target="_blank" rel="noreferrer" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group">
                Our College <ExternalLink size={22} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROFESSIONAL ABOUT SECTION */}
      <div className="grid lg:grid-cols-2 gap-16 items-center px-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10 group-hover:rotate-2 transition-transform duration-500"></div>
          <div className="absolute inset-0 bg-orange-500 rounded-3xl -rotate-2 opacity-10 group-hover:-rotate-1 transition-transform duration-500"></div>
          <img 
            src="https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702811/main_pic_makaut_nfnrzv.jpg" 
            alt="MAKAUT Campus" 
            className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover transform transition-transform duration-500 hover:scale-[1.01]"
          />
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl z-20 hidden md:block border-l-4 border-blue-600">
            <p className="text-4xl font-bold text-blue-900">2001</p>
            <p className="text-gray-500 font-medium">Established Year</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full font-bold text-xs tracking-wide uppercase mb-4">
              <BookOpen size={14} /> About Our University
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Fostering Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Technology & Innovation</span>
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Maulana Abul Kalam Azad University of Technology (MAKAUT), West Bengal, formerly known as West Bengal University of Technology (WBUT), is a state university providing high-quality education in technology and management.
            </p>
            <p>
              Since its inception, the university has been a pillar of academic strength, producing graduates who lead in global corporations, research institutions, and entrepreneurial ventures. Our alumni network is a living testament to this legacy.
            </p>
          </div>

          <div className="pt-4">
             <a href="https://makautwb.ac.in/about_us.php" target="_blank" rel="noreferrer" className="text-blue-700 font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all group">
                Read Our Full History <ArrowRight size={20} className="group-hover:text-orange-500 transition-colors" />
             </a>
          </div>
        </div>
      </div>

      {/* 3. VISION, MISSION & GOALS */}
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Visionary Framework</h2>
          <p className="text-gray-500 mt-3 text-lg">The core principles guiding our institution's journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visionCards.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
              <div className="h-56 overflow-hidden relative shrink-0">
                <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-90 z-10`}></div>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-grow bg-gray-50 group-hover:bg-white transition-colors">
                <p className="text-gray-700 text-base leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADMIN LOGIN BUTTON */}
      {!user && (
        <div className="fixed bottom-8 right-8 z-40">
          <button onClick={() => setShowAdminLogin(true)} className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-black border-2 border-slate-700 flex items-center gap-3 font-bold pr-6 transition-transform hover:scale-105 group">
            <div className="bg-red-600 p-1.5 rounded-full group-hover:animate-pulse">
              <Shield size={16} className="text-white" /> 
            </div>
            Admin Portal
          </button>
        </div>
      )}

      {/* 4. DONATE & MEMBERSHIP */}
      {user && (
        <div className="grid md:grid-cols-2 gap-8 px-4">
          {/* Donate */}
          <div className="bg-gradient-to-br from-pink-600 to-rose-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} className="text-white fill-current" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Support Your Alma Mater</h2>
              <p className="text-pink-100 mb-8 text-lg leading-relaxed">Your generous contribution helps us organize better events, maintain campus facilities, and provide scholarships to deserving students.</p>
              <button onClick={() => setShowDonateModal(true)} className="bg-white text-pink-700 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-pink-50 transition-colors text-base">
                Donate Now
              </button>
            </div>
          </div>

          {/* Membership */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Crown size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Premium Membership</h2>
              <p className="text-orange-100 mb-8 text-lg leading-relaxed">Unlock exclusive benefits including premium job listings, priority event registration, and direct networking access.</p>
              <button onClick={() => setActiveTab('membership')} className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-orange-50 transition-colors text-base">
                {user?.membershipStatus === 'premium' ? 'View Benefits' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. UPCOMING EVENTS */}
      <div className="px-4">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 mt-2 text-lg">Join us in our upcoming seminars and meetups</p>
          </div>
          <button onClick={() => setActiveTab('events')} className="text-blue-600 font-bold hover:text-blue-800 hidden sm:flex items-center gap-2 text-base">
            View All Events <ArrowRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group cursor-pointer flex flex-col h-full">
                <div className="h-52 bg-slate-900 relative p-6 flex flex-col justify-center items-center text-white group-hover:bg-blue-900 transition-colors shrink-0">
                  <span className="text-5xl mb-3">📅</span>
                  <span className="font-bold text-2xl">{new Date(event.date).toDateString()}</span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                     <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{event.title}</h3>
                     <p className="text-gray-600 line-clamp-2 mb-4 text-sm">{event.description}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm gap-2 pt-4 border-t border-gray-100">
                    <MapPin size={16} className="text-orange-500" /> {event.location || 'Online'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium text-lg">No upcoming events scheduled at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. PLACED STUDENTS */}
      <div className="bg-slate-900 rounded-3xl p-10 md:p-20 text-white text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h2 className="text-3xl md:text-4xl font-bold mb-16 relative z-10">Our Alumni Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {placedStudents.map((student, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all transform hover:-translate-y-3">
              <div className="w-28 h-28 rounded-full mx-auto mb-6 p-1.5 border-2 border-orange-500 shadow-lg">
                <img src={student.image} alt={student.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{student.name}</h3>
              <p className="text-orange-400 font-medium mb-4">{student.role}</p>
              <div className="inline-block bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-md">{student.company}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. EVENT GALLERY */}
      <div className="px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Campus Moments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <div key={idx} className={`relative group overflow-hidden rounded-3xl cursor-pointer shadow-lg ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" style={{ minHeight: idx === 0 ? '400px' : '220px' }} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold tracking-wider border-2 border-white px-6 py-2 rounded-full text-sm uppercase">View Full</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. CONTACT FORM */}
      <div className="grid lg:grid-cols-2 gap-16 items-center px-4">
        {/* Contact Info */}
        <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 border border-indigo-100 h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6">Get in Touch</h2>
          <p className="text-indigo-700 mb-10 text-lg leading-relaxed">
            Have questions, suggestions, or want to reconnect? Reach out to the Alumni Association directly. We are here to help!
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 shrink-0 border border-orange-100"><MapPin size={28} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Our Address</h3>
                <p className="text-gray-600">City Office: BF-142, Sector-I, Saltlake City, Kolkata-64</p>
                <p className="text-gray-600 mt-1">Main Office: NH12, Simhat, Nadia, West Bengal, 741249</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500 shrink-0 border border-blue-100"><Mail size={28} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
                <p className="text-gray-600">makautwb.alumni@gmail.com</p>
                <p className="text-sm text-gray-400 mt-1">Response time: Within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500 shrink-0 border border-green-100"><Phone size={28} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Call Us</h3>
                <p className="text-gray-800 font-bold text-xl tracking-wide">033 2589 1555</p>
                <p className="text-sm text-gray-500 mt-1">Mon - Fri, 9am - 5pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
                  placeholder="john@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
              <input 
                required
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
                placeholder="e.g. Inquiry about upcoming event"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
              <textarea 
                required
                rows="5"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base resize-none"
                placeholder="How can we help you today?"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              disabled={formStatus === 'sending'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {formStatus === 'sending' ? 'Sending Message...' : <><Send size={20} /> Send Message</>}
            </button>
            {formStatus === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200 animate-in fade-in">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {formStatus === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium border border-red-200 animate-in fade-in">
                Failed to send. Please check your connection and try again.
              </div>
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