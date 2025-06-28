import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    party: '',
    age: ''
  });

  // Handle session expiry
  const handleSessionExpiry = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    alert('Your session has expired. Please login again.');
    navigate('/login');
  };

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token');
    
    if (!token || !isAdmin) {
      alert('Access denied. Admin privileges required.');
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:5000/candidate/allcandidates');
        if (response.ok) {
          const data = await response.json();
          setCandidates(data);
        } else {
          setError('Failed to fetch candidates');
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/candidate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          party: formData.party,
          age: parseInt(formData.age)
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Candidate added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', party: '', age: '' });
        // Refresh candidates list
        window.location.reload();
      } else {
        if (result.message === 'user does not have admin role') {
          alert('Access denied. Admin privileges required.');
          navigate('/login');
        } else {
          alert(result.error || 'Failed to add candidate');
        }
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Error connecting to server');
    }
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/candidate/${editingCandidate._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          party: formData.party,
          age: parseInt(formData.age)
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Candidate updated successfully!');
        setEditingCandidate(null);
        setFormData({ name: '', party: '', age: '' });
        // Refresh candidates list
        window.location.reload();
      } else {
        if (result.message === 'user does not have admin role') {
          alert('Access denied. Admin privileges required.');
          navigate('/login');
        } else {
          alert(result.error || 'Failed to update candidate');
        }
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Error connecting to server');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    const confirmed = window.confirm('Are you sure you want to delete this candidate?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/candidate/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        alert('Candidate deleted successfully!');
        // Refresh candidates list
        window.location.reload();
      } else {
        if (result.message === 'user does not have admin role') {
          alert('Access denied. Admin privileges required.');
          navigate('/login');
        } else {
          alert(result.error || 'Failed to delete candidate');
        }
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Error connecting to server');
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age.toString()
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCandidate(null);
    setFormData({ name: '', party: '', age: '' });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Panel - Manage Candidates</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Candidate
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingCandidate) && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={editingCandidate ? handleUpdateCandidate : handleAddCandidate}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter candidate name"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Party</label>
                  <input
                    type="text"
                    className="form-control"
                    name="party"
                    required
                    value={formData.party}
                    onChange={handleChange}
                    placeholder="Enter party name"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingCandidate ? 'Update' : 'Add'} Candidate
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-center">Profile</th>
              <th scope="col">Name</th>
              <th scope="col">Age</th>
              <th scope="col">Party</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td className="text-center">
                    <img src="/img.jpg" alt="Candidate" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }} />
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.age} years</td>
                  <td>{candidate.party}</td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(candidate)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCandidate(candidate._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No candidates available at the moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 