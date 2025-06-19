import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

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
          setUserData(data.user);
        } else if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('adharId');
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading account details...</p>
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

  if (!userData) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          No user data found
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-black">
      <h2 className="mb-4 text-center">Account Details</h2>
      <form className="border p-4 rounded bg-white shadow-sm">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={userData.name} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input type="number" className="form-control" value={userData.age} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={userData.email || 'Not provided'} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input type="tel" className="form-control" value={userData.mobile} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Aadhar ID</label>
          <input type="text" className="form-control" value={userData.adharId} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea className="form-control" rows="3" value={userData.address} readOnly></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <input type="text" className="form-control" value={userData.role} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Voted</label>
          <input type="text" className="form-control" value={userData.isVoted ? "Yes" : "No"} readOnly />
        </div>

        <div className="mb-3 text-end">
          <Link to="/change-password" className="text-decoration-none">
            Change Password
          </Link>
        </div>
      </form>
    </div>
  );
}
