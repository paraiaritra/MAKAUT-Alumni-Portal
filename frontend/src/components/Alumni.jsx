import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, X, Mail, Phone, User, Calendar, BookOpen } from 'lucide-react';

const Alumni = ({ alumniAPI }) => {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null); // For Modal

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
    a.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alumni Directory</h2>
          <p className="text-gray-500">Connect with {alumniList.length} graduates</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, company, or batch..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
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

      {/* Alumni Detail Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <button 
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full z-10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Banner & Header */}
            <div className="h-28 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="px-8 pb-8 -mt-12 text-center">
              <img 
                src={selectedAlumni.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                alt={selectedAlumni.name} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto object-cover bg-white"
              />
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{selectedAlumni.name}</h2>
              <p className="text-indigo-600 font-medium">{selectedAlumni.department} Class of {selectedAlumni.batch}</p>
              
              <div className="mt-6 space-y-3 text-left">
                {selectedAlumni.company && (
                  <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                    <Briefcase size={20} className="text-indigo-500" />
                    <span>Works at <strong>{selectedAlumni.company}</strong></span>
                  </div>
                )}
                {selectedAlumni.email && (
                  <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-indigo-500" />
                    <a href={`mailto:${selectedAlumni.email}`} className="hover:text-indigo-600">{selectedAlumni.email}</a>
                  </div>
                )}
                {/* Additional details can be fetched here if needed */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumni;