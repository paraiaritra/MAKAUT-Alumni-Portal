import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, MapPin, Calendar, Edit3, Award, BookOpen, Linkedin, Twitter, Globe } from 'lucide-react';
import { alumniAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';

const UserProfile = ({ user, onUpdateRefresh }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch extended profile data (Bio, Skills, etc.) from Backend
  const fetchProfile = async () => {
    try {
      const { data } = await alumniAPI.getAlumniById(user._id);
      // The backend returns { user: ..., profile: ... }
      // We store the 'profile' part which has bio, skills, etc.
      setProfileData(data.profile); 
    } catch (error) {
      console.error("Failed to load profile details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const handleUpdateSuccess = () => {
    fetchProfile(); // Refresh local data immediately
    if (onUpdateRefresh) onUpdateRefresh(); // Refresh parent/auth data
  };

  if (!user) return <div className="p-8 text-center">Please log in.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                <img 
                  src={user.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {user.membershipStatus === 'premium' && (
                <div className="absolute bottom-1 right-1 bg-yellow-400 p-1.5 rounded-full shadow-sm border-2 border-white" title="Premium Member">
                  <Award size={16} className="text-yellow-900" />
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-indigo-600 font-medium text-lg mt-1">
              {profileData?.bio ? profileData.bio.split('.')[0] + '...' : user.department + ' Batch of ' + user.batch}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              {profileData?.company && ( // Use profileData for company/bio
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span>{profileData.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Class of {user.batch}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Bio & Skills */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-500" /> About
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {profileData?.bio || "No bio added yet. Click 'Edit Profile' to introduce yourself!"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" /> Skills & Expertise
            </h3>
            {profileData?.skills && profileData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No skills listed.</p>
            )}
          </div>
        </div>

        {/* Right Column - Membership Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Membership</h3>
            <div className={`p-4 rounded-xl border ${user.membershipStatus === 'premium' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="font-semibold text-gray-900 capitalize">
                {user.membershipStatus === 'premium' ? 'Premium Member 🌟' : 'Free Member'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {user.membershipStatus === 'premium' && user.membershipExpiry 
                  ? 'Valid until ' + new Date(user.membershipExpiry).toLocaleDateString() 
                  : 'Upgrade to access exclusive events'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Render Edit Modal inside Profile Page */}
      {showEditModal && (
        <EditProfileModal 
          user={user} 
          onClose={() => setShowEditModal(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default UserProfile;