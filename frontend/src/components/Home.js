import React, { useState, useEffect } from 'react';

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

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

  // Fetch user profile to check if already voted
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5000/user/profile', {
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
        }
      } catch (error) {
        // ignore
      }
    };
    fetchUserProfile();
  }, []);

  const handleVote = async (candidate) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to vote!');
      return;
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('Please login to vote!');
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
      const response = await fetch(`http://localhost:5000/candidate/vote/${candidate._id}`, {
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
        if (response.status === 400 && result.message === 'You have already voted') {
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
      <div className="d-flex justify-content-center flex-wrap gap-3">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate._id} className="card" style={{ width: '18rem' }}>
              <img src="/img.jpg" className="card-img-top" alt="Candidate" />
              <div className="card-body">
                <h5 className="card-title">{candidate.name}</h5>
                <p className="card-text">
                  <strong>Party:</strong> {candidate.party}<br />
                  <strong>Age:</strong> {candidate.age} years
                </p>
                {hasVoted ? (
                  <button className="btn btn-secondary w-100" disabled>
                    You have Voted!!
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => handleVote(candidate)}
                  >
                    Vote
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p>No candidates available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
