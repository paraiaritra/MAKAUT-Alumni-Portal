import React, { useEffect, useState } from 'react';
import { Users, Calendar, Briefcase, TrendingUp, Award, MapPin, ShieldCheck, Crown } from 'lucide-react';
import EditProfileModal from './EditProfileModal'; // Ensure this matches your filename

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

  // Helper to refresh data (reload page to show new avatar/status)
  const refreshData = () => {
    window.location.reload(); 
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

  const StatCard = ({ icon: Icon, label, value, color, gradient, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/90 text-sm font-medium mb-1">{label}</p>
          <p className="text-4xl font-bold text-white">{loading ? '...' : value}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={14} className="text-white/80" />
            <span className="text-xs text-white/80">Active</span>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
          <Icon className="text-white" size={32} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Total Alumni"
          value={stats.alumni}
          gradient="from-blue-500 to-blue-600"
          onClick={() => setActiveTab('alumni')}
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Events"
          value={stats.events}
          gradient="from-green-500 to-emerald-600"
          onClick={() => setActiveTab('events')}
        />
        <StatCard
          icon={Briefcase}
          label="Job Openings"
          value={stats.jobs}
          gradient="from-purple-500 to-pink-600"
          onClick={() => setActiveTab('jobs')}
        />
      </div>

      {/* Welcome Section with User Profile */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="p-8 text-white relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture (Clickable) */}
          <div className="relative group cursor-pointer" onClick={() => setShowEditModal(true)}>
            <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden shadow-lg bg-white/10">
              <img 
                src={user?.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Hover Edit Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-xs font-bold text-white">Edit</span>
            </div>
            {user?.membershipStatus === 'premium' && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg" title="Premium Member">
                <Crown size={20} fill="currentColor" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Alumni'}!</h2>
              {user?.role === 'admin' && (
                <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-full border border-red-400 flex items-center gap-1">
                  <ShieldCheck size={12} /> Admin
                </span>
              )}
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              {user?.role === 'admin' 
                ? "You have full access to manage alumni verifications, job postings, and events." 
                : "Explore opportunities, connect with batchmates, and stay updated with your alma mater."}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
             {/* Admin Quick Link */}
             {user?.role === 'admin' && (
               <button 
                onClick={() => setActiveTab('admin')}
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2"
               >
                 <ShieldCheck size={18} /> Admin Dashboard
               </button>
             )}
             
             {/* Upload/Edit Profile Button - NOW CLICKABLE */}
             <button 
                onClick={() => setShowEditModal(true)} 
                className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-6 py-2 rounded-lg font-semibold backdrop-blur-sm transition-all"
             >
                Edit Profile
             </button>
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentEvent ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                <Calendar size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Latest Event</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">{recentEvent.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{recentEvent.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{new Date(recentEvent.date).toLocaleDateString()}</span>
              </div>
              <button onClick={() => setActiveTab('events')} className="w-full mt-4 bg-green-50 text-green-600 py-2.5 rounded-lg hover:bg-green-100 transition-all font-semibold">
                View Details
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-center justify-center text-center py-10">
            <Calendar className="text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}

        {recentJob ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                <Briefcase size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Latest Job</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">{recentJob.position}</h4>
              <p className="text-md font-medium text-indigo-600">{recentJob.company}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                  {recentJob.type}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold flex items-center gap-1">
                  <MapPin size={12} /> {recentJob.location}
                </span>
              </div>
              <button onClick={() => setActiveTab('jobs')} className="w-full mt-4 bg-purple-50 text-purple-600 py-2.5 rounded-lg hover:bg-purple-100 transition-all font-semibold">
                Apply Now
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-center justify-center text-center py-10">
            <Briefcase className="text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No job openings yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setActiveTab('alumni')} className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left">
            <Users className="text-blue-600 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Directory</p>
          </button>
          <button onClick={() => setActiveTab('events')} className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-left">
            <Calendar className="text-green-600 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Events</p>
          </button>
          <button onClick={() => setActiveTab('jobs')} className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-left">
            <Briefcase className="text-purple-600 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Jobs</p>
          </button>
          <button onClick={() => setShowEditModal(true)} className="p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-left">
            <Award className="text-orange-600 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Profile</p>
          </button>
        </div>
      </div>

      {/* FIX: CONDITIONAL RENDERING - This prevents the modal from opening immediately */}
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