import React, { useEffect, useState } from 'react';
import { Users, Calendar, Briefcase, TrendingUp, Award, MapPin } from 'lucide-react';

const Dashboard = ({ eventsAPI, jobsAPI, alumniAPI }) => {
  const [stats, setStats] = useState({
    events: 0,
    jobs: 0,
    alumni: 0,
  });
  const [recentEvent, setRecentEvent] = useState(null);
  const [recentJob, setRecentJob] = useState(null);
  const [loading, setLoading] = useState(true);

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
        events: eventsRes.data.length,
        jobs: jobsRes.data.length,
        alumni: alumniRes.data.length,
      });

      if (eventsRes.data.length > 0) setRecentEvent(eventsRes.data[0]);
      if (jobsRes.data.length > 0) setRecentJob(jobsRes.data[0]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
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
          color="blue"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Events"
          value={stats.events}
          color="green"
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          icon={Briefcase}
          label="Job Openings"
          value={stats.jobs}
          color="purple"
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Award size={32} />
            <h2 className="text-3xl font-bold">Welcome to MAKAUT Alumni Portal</h2>
          </div>
          <p className="text-lg text-white/90 mb-6 max-w-3xl">
            Connect with fellow alumni, discover career opportunities, and stay updated with
            upcoming events. Our community brings together graduates from all batches and
            departments to foster growth and collaboration.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold">🎓 20+ Departments</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold">🌟 Growing Network</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold">🚀 Career Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Event */}
        {recentEvent && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Latest Event</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">{recentEvent.title}</h4>
              <p className="text-sm text-gray-600">{recentEvent.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{new Date(recentEvent.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {recentEvent.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>{recentEvent.location}</span>
                </div>
              )}
              <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Recent Job */}
        {recentJob && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                <Briefcase className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Latest Job</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">{recentJob.position}</h4>
              <p className="text-md font-medium text-indigo-600">{recentJob.company}</p>
              <p className="text-sm text-gray-600">{recentJob.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  {recentJob.type}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <MapPin size={12} />
                  {recentJob.location}
                </span>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
                Apply Now
              </button>
            </div>
          </div>
        )}

        {/* No Events */}
        {!recentEvent && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Recent Events</h4>
            <p className="text-sm text-gray-500">Check back soon for upcoming events!</p>
          </div>
        )}

        {/* No Jobs */}
        {!recentJob && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Recent Jobs</h4>
            <p className="text-sm text-gray-500">New opportunities will appear here!</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-left group">
            <Users className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-800">Browse Alumni</p>
            <p className="text-xs text-gray-500 mt-1">Connect with peers</p>
          </button>
          <button className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-left group">
            <Calendar className="text-green-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-800">View Events</p>
            <p className="text-xs text-gray-500 mt-1">Join upcoming events</p>
          </button>
          <button className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-left group">
            <Briefcase className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-800">Explore Jobs</p>
            <p className="text-xs text-gray-500 mt-1">Find opportunities</p>
          </button>
          <button className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-200 text-left group">
            <Award className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-800">Update Profile</p>
            <p className="text-xs text-gray-500 mt-1">Keep info current</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;