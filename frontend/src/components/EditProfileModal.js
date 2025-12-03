import React, { useState } from 'react';
import { X, Upload, CreditCard, User, Loader, Briefcase, Book } from 'lucide-react';
import { alumniAPI, paymentAPI } from '../services/api';

const EditProfileModal = ({ user, onClose, onUpdateSuccess }) => {
  const [activeTab, setActiveTab] = useState('details'); 
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: user?.profile?.bio || '', // Short bio
    about: user?.profile?.about || '', // Long description
    company: user?.company || '',
    location: user?.location || '',
    skills: user?.profile?.skills ? user.profile.skills.join(', ') : '', // Comma separated
    experience: user?.profile?.experience || '' // Text block
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert comma-separated skills to array
      const submissionData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      await alumniAPI.updateProfile(submissionData);
      alert('Profile Updated Successfully!');
      onUpdateSuccess(); 
      onClose();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep existing Image Upload and Payment logic from previous steps) ...
  // (I am omitting the payment/upload functions here to focus on the new Edit Fields, 
  // ensure you merge or keep the previous payment logic if you overwrite the file)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    setLoading(true);
    try {
      await alumniAPI.uploadAvatar(data);
      alert('Profile Picture Updated!');
      onUpdateSuccess();
      onClose();
    } catch (err) { alert('Upload failed'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="flex border-b bg-gray-50">
          {['details', 'professional', 'photo', 'membership'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? <div className="text-center py-10"><Loader className="animate-spin mx-auto" /> Processing...</div> : (
            <>
              {activeTab === 'details' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company / Organization</label>
                    <input className="w-full border p-2 rounded" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Headline / Bio (Short)</label>
                    <input className="w-full border p-2 rounded" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="e.g. Software Engineer at Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">About Me (Detailed)</label>
                    <textarea className="w-full border p-2 rounded h-32" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="Tell your story..."></textarea>
                  </div>
                  <button className="btn-primary w-full bg-indigo-600 text-white py-2 rounded">Save Basic Info</button>
                </form>
              )}

              {activeTab === 'professional' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Skills (Comma separated)</label>
                    <input className="w-full border p-2 rounded" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js, Leadership" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience / Work History</label>
                    <textarea className="w-full border p-2 rounded h-32" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="Describe your career path..."></textarea>
                  </div>
                  <button className="btn-primary w-full bg-indigo-600 text-white py-2 rounded">Save Professional Info</button>
                </form>
              )}

              {activeTab === 'photo' && (
                <div className="text-center py-10">
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200 overflow-hidden mb-4">
                    <img src={user.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  <label className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer">
                    Upload New Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
              
              {/* Membership tab content can be reused from previous version */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;