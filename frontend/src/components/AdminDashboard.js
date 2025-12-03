import React, { useState, useEffect } from 'react';
import { adminAPI, jobsAPI, eventsAPI, contactAPI } from '../services/api';
import { Users, Briefcase, Calendar, MessageSquare, Trash2, Eye, Plus, Check, Crown } from 'lucide-react';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('unverified'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, [activeView]);

  const loadData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeView === 'unverified') res = await adminAPI.getUnverifiedUsers();
      if (activeView === 'members') res = await adminAPI.getPremiumMembers(); // NEW
      if (activeView === 'jobs') res = await jobsAPI.getAllJobs();
      if (activeView === 'events') res = await eventsAPI.getAllEvents();
      if (activeView === 'messages') res = await contactAPI.getMessages();
      setData(res.data || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleVerify = async (id) => { await adminAPI.verifyUser(id); loadData(); };
  
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    if (activeView === 'jobs') await jobsAPI.deleteJob(id);
    if (activeView === 'events') await eventsAPI.deleteEvent(id);
    loadData();
  };

  const handleViewDetails = async (item) => {
    // Show full details for members
    const details = `
      Name: ${item.name}
      Email: ${item.email}
      Mobile: ${item.mobileNumber}
      Reg No: ${item.registrationNumber}
      Dept: ${item.department}
      Batch: ${item.batch}
      Gender: ${item.gender}
      Membership Expiry: ${new Date(item.membershipExpiry).toDateString()}
    `;
    alert(details);
  };

  const handleViewApplicants = async (id) => {
    try {
      let res;
      if (activeView === 'jobs') res = await jobsAPI.getApplications(id);
      if (activeView === 'events') res = await eventsAPI.getParticipants(id);
      
      const applicants = res.data.map(i => {
        const u = i.user || {};
        return `${u.name} (${u.email}) - ${u.mobileNumber || 'No Phone'}`;
      }).join('\n');
      
      alert(applicants || "No participants yet.");
    } catch (err) { alert("Could not fetch details."); }
  };

  const handleCreate = async () => {
    if (activeView === 'jobs') {
      const company = prompt("Company:");
      const position = prompt("Position:");
      const location = prompt("Location:");
      const salary = prompt("Salary:");
      if(company) await jobsAPI.createJob({ company, position, description: "New Opportunity", location, salary, type: "Full-time" });
    }
    if (activeView === 'events') {
      const title = prompt("Title:");
      const date = prompt("Date (YYYY-MM-DD):");
      if(title) await eventsAPI.createEvent({ title, date, description: "New Event", location: "Campus", time: "10:00 AM" });
    }
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Console</h1>
        
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'unverified', label: 'Verify', icon: Users },
            { id: 'members', label: 'Premium Members', icon: Crown }, // NEW TAB
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'messages', label: 'Feedback', icon: MessageSquare },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${activeView === tab.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {(activeView === 'jobs' || activeView === 'events') && (
          <div className="flex justify-end mb-6">
            <button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg">
              <Plus size={20} /> Create New
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? <div className="p-12 text-center text-slate-400">Loading...</div> : data.length === 0 ? <div className="p-12 text-center text-slate-400">No records found.</div> : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-5">Name / Title</th>
                  <th className="p-5">Primary Info</th>
                  <th className="p-5">Secondary Info</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-medium text-slate-900">
                      {item.name || item.title || item.company || item.position}
                    </td>
                    <td className="p-5 text-sm text-slate-600">
                      {(activeView === 'unverified' || activeView === 'members') && item.email}
                      {activeView === 'jobs' && item.position}
                      {activeView === 'events' && new Date(item.date).toDateString()}
                      {activeView === 'messages' && item.email}
                    </td>
                    <td className="p-5 text-sm text-slate-600">
                      {(activeView === 'unverified' || activeView === 'members') && `${item.department} (${item.batch})`}
                      {activeView === 'jobs' && item.location}
                      {activeView === 'events' && item.location}
                      {activeView === 'messages' && <span className="italic truncate block max-w-xs">{item.message}</span>}
                    </td>
                    <td className="p-5 text-right flex justify-end gap-3">
                      {activeView === 'unverified' && <button onClick={() => handleVerify(item._id)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200"><Check size={18} /></button>}
                      
                      {/* View Details for Members */}
                      {activeView === 'members' && (
                        <button onClick={() => handleViewDetails(item)} className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200" title="View Full Profile">
                          <Eye size={18} />
                        </button>
                      )}

                      {(activeView === 'jobs' || activeView === 'events') && (
                        <>
                          <button onClick={() => handleViewApplicants(item._id)} className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200"><Users size={18} /></button>
                          <button onClick={() => handleDelete(item._id)} className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"><Trash2 size={18} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;