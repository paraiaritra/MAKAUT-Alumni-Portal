import React, { useEffect, useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAllJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobsAPI.createJob(newJob);
      setShowModal(false);
      setNewJob({
        company: '',
        position: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
      });
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.response?.data?.message || 'Error creating job');
    }
  };

  const handleApply = async (jobId) => {
    try {
      await jobsAPI.applyForJob(jobId);
      alert('Successfully applied for job!');
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying for job');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Job Opportunities</h2>
        {user && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Post Job
          </button>
        )}
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <Briefcase className="text-purple-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{job.position}</h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-sm text-gray-600">📍 {job.location}</span>
                    <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{job.description}</p>
                  {job.postedBy && (
                    <p className="text-xs text-gray-500 mt-2">
                      Posted by: {job.postedBy.name} ({job.postedBy.batch})
                    </p>
                  )}
                </div>
              </div>
              {user && (
                <button
                  onClick={() => handleApply(job._id)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium whitespace-nowrap"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Post New Job</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Position/Role"
                value={newJob.position}
                onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Job Description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <input
                type="text"
                placeholder="Salary (optional)"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Post Job
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;