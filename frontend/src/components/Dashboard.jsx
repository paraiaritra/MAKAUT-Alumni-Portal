import React, { useEffect, useState } from 'react';
import { Users, Calendar, Briefcase, TrendingUp, Award, MapPin, ShieldCheck, Crown, Edit3 } from 'lucide-react';
import EditProfileModal from './EditProfileModal'; 

const Dashboard = ({ eventsAPI, jobsAPI, alumniAPI, user, setActiveTab }) => {
  const [stats, setStats] = useState({
    events: 0,
    jobs: 0,
    alumni: 0,
  });
  const [recentEvent, setRecentEvent] = useState(null);
  const [recentJob, setRecentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // STATE TO CONTROL MODAL VISIBILITY
  const [showEditModal, setShowEditModal] = useState(false);

  // Helper to refresh data
  const refreshData = () => {
    // We avoid window.location.reload() to prevent logging out
    console.log("Profile updated");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, jobsRes, alumniRes] = await Promise.all([
        eventsAPI.getAllEvents(),
        jobsAPI.getAllJobs(),
        alumniAPI.getAllAlumni(),
      ]);

      setStats({
        events: eventsRes?.data?.length || 0,
        jobs: jobsRes?.data?.length || 0,
        alumni: alumniRes?.data?.length || 0,
      });

      if (eventsRes?.data?.length > 0) setRecentEvent(eventsRes.data[0]);
      if (jobsRes?.data?.length > 0) setRecentJob(jobsRes.data[0]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reusable Clean Stat Card
  const StatCard = ({ icon: Icon, label, value, colorClass, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-md border-b-4 border-indigo-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center group"
    >
      <div className={`p-4 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors mb-4 ${colorClass}`}>
        <Icon size={32} className="text-indigo-600" />
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{loading ? '...' : value}</h3>
      <p className="text-gray-500 font-medium">{label}</p>
    </div>
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Hero Section - Dark Professional Theme */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[300px] flex flex-col justify-center text-center px-4">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 opacity-95"></div>
        
        <div className="relative z-10 py-12">
          {/* Profile Photo */}
          <div className="w-28 h-28 mx-auto mb-6 rounded-full border-4 border-white/20 p-1 relative group cursor-pointer" onClick={() => setShowEditModal(true)}>
             <img 
                src={user?.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                 <Edit3 className="text-white w-8 h-8" />
              </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight uppercase">
            {user?.name || 'Alumni Member'}
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto font-light">
            {user?.role === 'admin' 
              ? 'Administrator Console • Managed Access' 
              : 'Welcome to the MAKAUT Alumni Association. Together We Learn, Together We Grow.'}
          </p>

          <div className="flex justify-center gap-4">
             {user?.role === 'admin' && (
               <button 
                onClick={() => setActiveTab('admin')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
               >
                 <ShieldCheck size={20} /> Admin Console
               </button>
             )}
             <button 
                onClick={() => setShowEditModal(true)} 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition-all"
             >
                Edit Profile
             </button>
          </div>
        </div>
      </div>

      {/* 2. Stats Section - Overlapping the Hero slightly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-12 relative z-20 px-4">
        <StatCard
          icon={Users}
          label="Registered Alumni"
          value={stats.alumni}
          colorClass="text-blue-600"
          onClick={() => setActiveTab('alumni')}
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Events"
          value={stats.events}
          colorClass="text-green-600"
          onClick={() => setActiveTab('events')}
        />
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.jobs}
          colorClass="text-purple-600"
          onClick={() => setActiveTab('jobs')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions - Styled like "Our Mission" cards from reference */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Directory', icon: Users, tab: 'alumni', color: 'bg-blue-50 text-blue-600' },
                 { label: 'Events', icon: Calendar, tab: 'events', color: 'bg-green-50 text-green-600' },
                 { label: 'Jobs', icon: Briefcase, tab: 'jobs', color: 'bg-purple-50 text-purple-600' },
                 { label: 'View Profile', icon: Award, tab: 'profile', color: 'bg-orange-50 text-orange-600' }
               ].map((item) => (
                 <button 
                   key={item.label}
                   onClick={() => setActiveTab(item.tab)}
                   className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group bg-white text-left"
                 >
                   <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                     <item.icon size={24} />
                   </div>
                   <div>
                     <span className="block font-bold text-gray-800 text-lg">{item.label}</span>
                     <span className="text-xs text-gray-500">Click to view</span>
                   </div>
                 </button>
               ))}
            </div>
          </div>

          {/* Recent Event - List Style */}
          {recentEvent && (
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
               <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <Calendar className="text-orange-500" size={20} /> Latest Event
                 </h3>
                 <button onClick={() => setActiveTab('events')} className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
               </div>
               <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                 <div className="bg-indigo-100 text-indigo-700 rounded-xl p-4 text-center min-w-[100px]">
                    <span className="block text-3xl font-bold">{new Date(recentEvent.date).getDate()}</span>
                    <span className="text-sm font-bold uppercase">{new Date(recentEvent.date).toLocaleString('default', { month: 'short' })}</span>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-gray-800 mb-2">{recentEvent.title}</h4>
                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recentEvent.description}</p>
                   <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {recentEvent.location || 'Online'}</span>
                   </div>
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-8">
           {/* Recent Job Card */}
           {recentJob ? (
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase className="text-orange-500" size={20} /> New Opportunity
                </h3>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                   <h4 className="font-bold text-gray-900 text-lg">{recentJob.position}</h4>
                   <p className="text-indigo-600 font-medium text-sm mb-3">{recentJob.company}</p>
                   <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-white border rounded text-xs font-medium text-gray-600">{recentJob.type}</span>
                      <span className="px-2 py-1 bg-white border rounded text-xs font-medium text-gray-600">{recentJob.location}</span>
                   </div>
                   <button onClick={() => setActiveTab('jobs')} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                     Apply Now
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
               <Briefcase className="mx-auto text-gray-400 mb-2" size={32}/>
               <p className="text-gray-500 font-medium">No jobs posted recently</p>
             </div>
           )}

           {/* Membership Status Box */}
           <div className={`rounded-2xl p-6 border ${user?.membershipStatus === 'premium' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-100' : 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                 {user?.membershipStatus === 'premium' ? <Crown className="text-orange-500" size={24} /> : <ShieldCheck className="text-gray-400" size={24} />}
                 <div>
                   <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Membership Status</p>
                   <p className="font-bold text-gray-900 capitalize text-lg">{user?.membershipStatus || 'Free'} Plan</p>
                 </div>
              </div>
              {user?.membershipStatus !== 'premium' && (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Upgrade Membership
                </button>
              )}
           </div>
        </div>

      </div>

      {/* Edit Modal (Conditional Render) */}
      {showEditModal && (
        <EditProfileModal 
          user={user} 
          onClose={() => setShowEditModal(false)}
          onUpdateSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default Dashboard;