import React, { useEffect, useState } from 'react';
import { Calendar, Plus, MapPin, Clock, Users, X } from 'lucide-react';

const Events = ({ eventsAPI, user }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Networking',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await eventsAPI.createEvent(newEvent);
      setShowModal(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Networking',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventsAPI.registerForEvent(eventId);
      alert('Successfully registered for event!');
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error registering for event');
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Networking': 'from-blue-500 to-indigo-600',
      'Workshop': 'from-purple-500 to-pink-600',
      'Seminar': 'from-green-500 to-emerald-600',
      'Social': 'from-orange-500 to-red-600',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
          <p className="text-gray-600">Connect, learn, and grow with your alumni community</p>
        </div>
        {user && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Create Event
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            {/* Event Header with Gradient */}
            <div className={`bg-gradient-to-r ${getEventTypeColor(event.type)} p-6 text-white`}>
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {event.type}
                </span>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Users size={14} />
                  <span className="text-xs font-semibold">
                    {event.registeredUsers?.length || 0} Registered
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
              <p className="text-white/90 text-sm line-clamp-2">{event.description}</p>
            </div>

            {/* Event Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <Calendar className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date</p>
                  <p className="font-semibold">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                    <Clock className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                    <MapPin className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
              )}

              {event.organizer && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Organized by</p>
                  <p className="text-sm font-medium text-gray-700">
                    {event.organizer.name} • {event.organizer.batch}
                  </p>
                </div>
              )}

              {user && (
                <button
                  onClick={() => handleRegister(event._id)}
                  className={`w-full bg-gradient-to-r ${getEventTypeColor(event.type)} text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold mt-4`}
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-indigo-600" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">Be the first to create an event for the community!</p>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 font-semibold"
            >
              <Plus size={20} />
              Create First Event
            </button>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">Create New Event</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  placeholder="Annual Alumni Meetup 2025"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Tell us about the event..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Main Campus Auditorium"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="Networking">Networking</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateEvent}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Create Event
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;