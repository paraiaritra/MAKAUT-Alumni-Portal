import React, { useState, useEffect } from 'react';
import { adminAPI, jobsAPI, eventsAPI, contactAPI } from '../services/api';
import { Users, Briefcase, Calendar, MessageSquare, Trash2, Eye, Plus, Check, Crown, ArrowLeft, Mail, Phone } from 'lucide-react';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('unverified'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for "Drill Down" view (showing participants for a specific job/event)
  const [detailView, setDetailView] = useState(null); // { type: 'job'|'event', parentTitle: string, list: [] }

  useEffect(() => { loadData(); }, [activeView]);

  const loadData = async () => {
    setLoading(true);
    setDetailView(null); // Reset detail view when switching tabs
    try {
      let res;
      if (activeView === 'unverified') res = await adminAPI.getUnverifiedUsers();
      if (activeView === 'members') res = await adminAPI.getPremiumMembers();
      if (activeView === 'jobs') res = await jobsAPI.getAllJobs();
      if (activeView === 'events') res = await eventsAPI.getAllEvents();
      if (activeView === 'messages') res = await contactAPI.getMessages();
      setData(res.data || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // --- ACTIONS ---
  const handleVerify = async (id) => { await adminAPI.verifyUser(id); loadData(); };
  
  // Generic Delete Handler
  const handleDelete = async (id, type) => {
    if(!window.confirm("Are you sure you want to delete this? This cannot be undone.")) return;
    
    try {
      if (type === 'user') await adminAPI.deleteUser(id); // Deletes User (Unverified or Member)
      if (type === 'job') await jobsAPI.deleteJob(id);
      if (type === 'event') await eventsAPI.deleteEvent(id);
      loadData();
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  const handleViewApplicants = async (item, type) => {
    setLoading(true);
    try {
      let res;
      if (type === 'job') res = await jobsAPI.getApplications(item._id);
      if (type === 'event') res = await eventsAPI.getParticipants(item._id);
      
      // Switch to Detail View
      setDetailView({
        type: type,
        parentTitle: type === 'job' ? item.position : item.title,
        list: res.data || []
      });
    } catch (err) { 
      alert("Could not fetch details."); 
    } finally {
      setLoading(false);
    }
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
        
        {/* Tabs (Hide when looking at details) */}
        {!detailView && (
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'unverified', label: 'Verify', icon: Users },
              { id: 'members', label: 'Premium', icon: Crown },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'messages', label: 'Feedback', icon: MessageSquare },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${activeView === tab.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* DETAIL VIEW (Participants List) */}
        {detailView ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <button onClick={() => setDetailView(null)} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all">
                  <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{detailView.type === 'job' ? 'Applicants for' : 'Participants in'}</p>
                  <h2 className="text-xl font-bold text-slate-800">{detailView.parentTitle}</h2>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                Total: {detailView.list.length}
              </span>
            </div>
            
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Mobile</th>
                  <th className="p-5">Reg No.</th>
                  <th className="p-5">Batch/Dept</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailView.list.map((item, idx) => {
                  // Some endpoints populate 'user' inside the array, others might differ. 
                  // Assuming standard structure { user: { ...data } } based on backend
                  const u = item.user || {}; 
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-5 font-medium text-slate-900">{u.name || 'N/A'}</td>
                      <td className="p-5 text-sm text-slate-600 flex items-center gap-2">
                        <Mail size={14} /> {u.email}
                      </td>
                      <td className="p-5 text-sm text-slate-600">{u.mobileNumber || 'N/A'}</td>
                      <td className="p-5 text-sm text-slate-600">{u.registrationNumber || 'N/A'}</td>
                      <td className="p-5 text-sm text-slate-600">{u.department} ({u.batch})</td>
                    </tr>
                  );
                })}
                {detailView.list.length === 0 && (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">No participants found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // MAIN LIST VIEW
          <>
            {/* Create Button */}
            {(activeView === 'jobs' || activeView === 'events') && (
              <div className="flex justify-end mb-6">
                <button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                  <Plus size={20} /> Create New
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {loading ? <div className="p-12 text-center text-slate-400">Loading...</div> : data.length === 0 ? <div className="p-12 text-center text-slate-400">No records found.</div> : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr><th className="p-5">Name / Title</th><th className="p-5">Details</th><th className="p-5 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 font-medium text-slate-900">{item.name || item.title || item.company || item.position}</td>
                        
                        <td className="p-5 text-sm text-slate-600">
                          {(activeView === 'unverified' || activeView === 'members') && 
                            <div className="flex flex-col">
                              <span>{item.department} ({item.batch})</span>
                              <span className="text-xs text-slate-400">{item.email}</span>
                            </div>
                          }
                          {activeView === 'jobs' && `${item.position} • ${item.location}`}
                          {activeView === 'events' && `${new Date(item.date).toDateString()}`}
                          {activeView === 'messages' && <span className="italic">"{item.message}"</span>}
                        </td>

                        <td className="p-5 text-right flex justify-end gap-3">
                          {/* Verify User Button */}
                          {activeView === 'unverified' && (
                            <button onClick={() => handleVerify(item._id)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200"><Check size={18} /></button>
                          )}
                          
                          {/* View Participants/Applicants Button */}
                          {(activeView === 'jobs' || activeView === 'events') && (
                            <button onClick={() => handleViewApplicants(item, activeView === 'jobs' ? 'job' : 'event')} className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200" title="View List">
                              <Eye size={18} />
                            </button>
                          )}

                          {/* Delete Button (Available for Users, Members, Jobs, Events) */}
                          {activeView !== 'messages' && (
                            <button 
                              onClick={() => handleDelete(item._id, (activeView === 'jobs' ? 'job' : activeView === 'events' ? 'event' : 'user'))} 
                              className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200" 
                              title="Delete / Remove"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;