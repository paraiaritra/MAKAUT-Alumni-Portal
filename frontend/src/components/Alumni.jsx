import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, X, Mail, Phone, Hash, Calendar, Users } from 'lucide-react';

const Alumni = ({ alumniAPI }) => {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const { data } = await alumniAPI.getAllAlumni();
      setAlumniList(data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumniList.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.batch.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alumni Directory</h2>
          <p className="text-gray-500">Connect with {alumniList.length} graduates</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, dept, or batch..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-3 text-center py-10">Loading directory...</p>
        ) : filteredAlumni.map((alum) => (
          <div 
            key={alum._id} 
            onClick={() => setSelectedAlumni(alum)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
          >
            <img 
              src={alum.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
              alt={alum.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-50"
            />
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{alum.name}</h3>
              <p className="text-sm text-gray-500">{alum.department} • {alum.batch}</p>
              {alum.company && (
                <div className="flex items-center gap-1 text-xs text-indigo-600 mt-1 font-medium">
                  <Briefcase size={12} /> {alum.company}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <button 
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full z-10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="px-8 pb-8 -mt-16 text-center">
              <img 
                src={selectedAlumni.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                alt={selectedAlumni.name} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto object-cover bg-white"
              />
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{selectedAlumni.name}</h2>
              <p className="text-indigo-600 font-medium text-lg">{selectedAlumni.department}</p>
              <p className="text-gray-500">Batch of {selectedAlumni.batch}</p>
              
              <div className="mt-8 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Hash size={14} /> Registration No
                    </div>
                    <p className="font-semibold text-gray-800">{selectedAlumni.registrationNumber || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Users size={14} /> Gender
                    </div>
                    <p className="font-semibold text-gray-800">{selectedAlumni.gender || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <Mail size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${selectedAlumni.email}`} className="font-medium text-gray-800 hover:text-indigo-600">{selectedAlumni.email}</a>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <Phone size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="font-medium text-gray-800">{selectedAlumni.mobileNumber || 'N/A'}</p>
                  </div>
                </div>

                {selectedAlumni.company && (
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                    <Briefcase size={18} className="text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="font-medium text-gray-800">{selectedAlumni.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumni;