import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink, ArrowRight, Heart, Shield, Phone, Mail } from 'lucide-react';
import EditProfileModal from './EditProfileModal'; 
import AdminAuth from './AdminAuth';
import DonateModal from './DonateModal'; 

const Dashboard = ({ eventsAPI, jobsAPI, alumniAPI, user, setActiveTab, onLoginClick }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

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

  return (
    <div className="font-sans text-gray-800">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://res.cloudinary.com/dyo7pelfy/image/upload/v1764702811/main_pic_makaut_nfnrzv.jpg")' }}>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl">
            Maulana Abul Kalam Azad University of Technology
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Empowering minds, shaping futures, and building a global community of innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {!user ? (
              <button onClick={onLoginClick} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
            ) : (
              <button onClick={() => setActiveTab('profile')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
                Go to Profile <ArrowRight size={20} />
              </button>
            )}
            <a href="https://makautwb.ac.in" target="_blank" rel="noreferrer" className="bg-white hover:bg-gray-100 text-indigo-900 px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
              Our College <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* ADMIN LOGIN BUTTON (Restored) */}
      {!user && (
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setShowAdminLogin(true)} 
            className="bg-slate-800 text-white p-3 rounded-full shadow-xl hover:bg-slate-900 border border-slate-700 flex items-center gap-2 text-sm font-bold pr-5 transition-transform hover:scale-105"
          >
            <Shield size={18} className="text-red-500" /> Admin Portal
          </button>
        </div>
      )}

      {/* DONATE SECTION */}
      {user && (
        <div className="mb-16 bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transform hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Heart size={40} className="text-white fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Support Your Alma Mater</h2>
              <p className="text-pink-100">Your contribution helps us organize better events and scholarship programs.</p>
            </div>
          </div>
          <button onClick={() => setShowDonateModal(true)} className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-50 transition-colors whitespace-nowrap">
            Donate Now
          </button>
        </div>
      )}

      {/* 3. UPCOMING EVENTS */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 mt-2">Join us in our upcoming seminars and meetups</p>
          </div>
          <button onClick={() => setActiveTab('events')} className="text-indigo-600 font-semibold hover:text-indigo-800 hidden sm:block">View All Events &rarr;</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
                <div className="h-40 bg-indigo-900 relative p-6 flex flex-col justify-center items-center text-white">
                  <span className="font-bold text-lg">{new Date(event.date).toDateString()}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <MapPin size={16} /> {event.location || 'Online'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. PLACED STUDENTS */}
      <div className="mb-16 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-10">Our Alumni Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {placedStudents.map((student, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all">
              <img src={student.image} alt={student.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 object-cover" />
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="text-orange-400 font-medium mb-1">{student.role}</p>
              <div className="inline-block bg-white text-indigo-900 px-3 py-1 rounded-full text-xs font-bold mt-2">{student.company}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. EVENT GALLERY */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Check Our Event Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="relative group overflow-hidden rounded-xl h-48 sm:h-64 cursor-pointer">
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* 6. CONTACT SECTION */}
      <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 border border-indigo-100 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-900">Contact Us</h2>
          <p className="text-indigo-600 mt-2">Get in touch with the Alumni Association</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin size={24} /></div>
            <h3 className="font-bold text-gray-800 mb-2">Our Address</h3>
            <p className="text-gray-600 text-sm"><span className="font-semibold block mb-1">City Office:</span> BF-142, Sector-I, Saltlake City, Kolkata-64</p>
            <p className="text-gray-600 text-sm mt-2"><span className="font-semibold block mb-1">Main Office:</span> NH12, Simhat, Nadia, West Bengal, 741249</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Mail size={24} /></div>
            <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
            <a href="mailto:makautwb.alumni@gmail.com" className="text-indigo-600 font-medium hover:underline">makautwb.alumni@gmail.com</a>
            <p className="text-xs text-gray-400 mt-2">We reply within 24 hours</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Phone size={24} /></div>
            <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
            <a href="tel:03325891555" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">033 2589 1555</a>
            <p className="text-xs text-gray-400 mt-2">Mon - Fri, 9am - 5pm</p>
          </div>
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