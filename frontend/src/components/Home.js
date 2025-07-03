import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Handle session expiry
  const handleSessionExpiry = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    alert('Your session has expired. Please login again.');
    navigate('/login');
  };

  // Check admin status
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await apiFetch('/candidate/allcandidates');
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

  // Fetch user profile to check if already voted
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await apiFetch('/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.isVoted) {
            setHasVoted(true);
          }
        } else {
          const data = await response.json();
          if (data.requireLogin || data.tokenExpired) {
            handleSessionExpiry();
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleVote = async (candidate) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to vote!');
      navigate('/login');
      return;
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('Please login to vote!');
      navigate('/login');
      return;
    }

    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (adminStatus) {
      alert('Admin users are not allowed to vote!');
      return;
    }

    // Show confirmation dialog with candidate name validation
    const userCandidateName = prompt(`Please enter the candidate name to confirm your vote for:\n\nCandidate: ${candidate.name}`);
    if (userCandidateName === null) {
      return; // User cancelled
    }
    if (userCandidateName.toLowerCase().trim() !== candidate.name.toLowerCase().trim()) {
      alert(`Incorrect candidate name! Please enter: ${candidate.name}`);
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to vote for ${candidate.name} (${candidate.party})?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`/candidate/vote/${candidate._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok) {
        alert('Vote recorded successfully!');
        setHasVoted(true);
      } else {
        if (result.requireLogin || result.tokenExpired) {
          handleSessionExpiry();
        } else if (response.status === 400 && result.message === 'You have already voted') {
          alert('You have already voted!');
          setHasVoted(true);
        } else if (response.status === 403 && result.message === 'admin is not allowed') {
          alert('Admin users are not allowed to vote!');
        } else {
          alert(result.message || 'Failed to record vote. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error connecting to server. Please try again.');
    }
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
      <h2 className="text-center mb-4">Candidates</h2>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-center">Profile</th>
              <th scope="col">Name</th>
              <th scope="col">Age</th>
              <th scope="col">Party</th>
              <th scope="col">Manifesto</th>
              <th scope="col" className="text-center">Action</th>
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
                    {isAdmin ? (
                      <button className="btn btn-secondary" disabled>
                        Admin Cannot Vote
                      </button>
                    ) : hasVoted ? (
                      <button className="btn btn-secondary" disabled>
                        You have Voted!!
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleVote(candidate)}
                      >
                        Vote
                      </button>
                    )}
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
