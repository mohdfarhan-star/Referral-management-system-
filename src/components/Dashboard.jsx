import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch candidates from API
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter candidates based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCandidates(candidates);
    } else {
      const filtered = candidates.filter(candidate =>
        candidate.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCandidates(filtered);
    }
  }, [searchTerm, candidates]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://referral-management-system-r80j.onrender.com/api/v1/candidates/getAllCandidates');
      if (response.data.success) {
        setCandidates(response.data.data || []);
      } else {
        setError('Failed to fetch candidates');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateId, newStatus) => {
    try {
      const response = await axios.post('https://referral-management-system-r80j.onrender.com/api/v1/candidates/updateCandidate', {
        candidateId,
        updatedStatus: newStatus
      });
      
      if (response.data.success) {
        // Update local state
        setCandidates(prev => 
          prev.map(candidate => 
            candidate._id === candidateId 
              ? { ...candidate, status: newStatus }
              : candidate
          )
        );
      } else {
        setError('Failed to update candidate status');
      }
    } catch (err) {
      setError('Error updating candidate status');
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidate Dashboard</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, job title, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No candidates found matching your search.' : 'No candidates found.'}
            </p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{candidate.name}</h3>
                <p className="text-gray-600 mb-2">{candidate.job_title}</p>
                <p className="text-sm text-gray-500 mb-2">📧 {candidate.email}</p>
                <p className="text-sm text-gray-500 mb-4">📞 {candidate.phone}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </span>
                {candidate.resume && (
                  <a
                    href={candidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📄 View Resume
                  </a>
                )}
              </div>

              {/* Status Update Dropdown */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status:
                </label>
                <select
                  value={candidate.status}
                  onChange={(e) => updateCandidateStatus(candidate._id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
