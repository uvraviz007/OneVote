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
    age: '',
    manifesto: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!selectedImage) {
      alert('Please select an image for the candidate');
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('party', formData.party);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('manifesto', formData.manifesto);
      formDataToSend.append('image', selectedImage);

      const response = await fetch('http://localhost:5000/candidate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        alert('Candidate added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', party: '', age: '', manifesto: '' });
        setSelectedImage(null);
        setImagePreview(null);
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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('party', formData.party);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('manifesto', formData.manifesto);
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch(`http://localhost:5000/candidate/${editingCandidate._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        alert('Candidate updated successfully!');
        setEditingCandidate(null);
        setFormData({ name: '', party: '', age: '', manifesto: '' });
        setSelectedImage(null);
        setImagePreview(null);
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
      age: candidate.age.toString(),
      manifesto: candidate.manifesto || ''
    });
    setSelectedImage(null);
    setImagePreview(candidate.image?.url || null);
    
    // Scroll to top of the screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCandidate(null);
    setFormData({ name: '', party: '', age: '', manifesto: '' });
    setSelectedImage(null);
    setImagePreview(null);
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
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingCandidate}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">Manifesto</label>
                  <textarea
                    className="form-control"
                    name="manifesto"
                    rows="3"
                    value={formData.manifesto}
                    onChange={handleChange}
                    placeholder="Enter candidate manifesto (optional)"
                  />
                </div>
              </div>
              {imagePreview && (
                <div className="mb-3">
                  <label className="form-label">Image Preview:</label>
                  <div>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </div>
                </div>
              )}
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
              <th scope="col">Manifesto</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td className="text-center">
                    <img 
                      src={candidate.image?.url || "/img.jpg"} 
                      alt={candidate.name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.src = "/img.jpg";
                      }}
                    />
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.age} years</td>
                  <td>{candidate.party}</td>
                  <td>
                    {candidate.manifesto ? (
                      <div>
                        <span 
                          title={candidate.manifesto}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            // Check if the manifesto is a URL
                            if (candidate.manifesto.match(/^https?:\/\//)) {
                              const confirmed = window.confirm(`You are about to be redirected to:\n${candidate.manifesto}\n\nDo you want to continue?`);
                              if (confirmed) {
                                window.open(candidate.manifesto, '_blank');
                              }
                            } else {
                              alert(`Manifesto for ${candidate.name}:\n\n${candidate.manifesto}`);
                            }
                          }}
                        >
                          {candidate.manifesto.length > 50 
                            ? `${candidate.manifesto.substring(0, 50)}...` 
                            : candidate.manifesto
                          }
                        </span>
                        <br />
                        <small className="text-muted">
                          {candidate.manifesto.match(/^https?:\/\//) 
                            ? 'Click to visit manifesto website' 
                            : 'Click to view full manifesto'
                          }
                        </small>
                      </div>
                    ) : (
                      <span className="text-muted">No manifesto added</span>
                    )}
                  </td>
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
                <td colSpan="6" className="text-center">No candidates available at the moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 