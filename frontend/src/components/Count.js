import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export default function Count() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [voteCounts, setVoteCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vote counts from API
  const fetchVoteCounts = async () => {
    try {
      const response = await apiFetch('/candidate/vote/count');
      
      if (response.ok) {
        const data = await response.json();
        setVoteCounts(data);
      } else {
        setError('Failed to fetch vote counts');
      }
    } catch (error) {
      console.error('Error fetching vote counts:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Update current time and vote counts every 5 seconds
  useEffect(() => {
    // Initial fetch
    fetchVoteCounts();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      fetchVoteCounts(); // Refresh vote counts
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading vote counts...</p>
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
    <div className="container mt-5 text-black">
      <h2 className="text-center mb-4">Live Vote Counts</h2>

      <p className="text-center mb-4">
        <strong>{currentTime.toLocaleString()}</strong>
      </p>

      {voteCounts.length > 0 ? (
        <div className="list-group">
          {voteCounts.map((party, index) => (
            <div
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <strong>{party.name}</strong>
              <span className="badge bg-success rounded-pill">{party.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No vote counts available at the moment.</p>
        </div>
      )}
    </div>
  );
}
