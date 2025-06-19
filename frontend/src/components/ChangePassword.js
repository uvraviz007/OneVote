import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/user/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Password changed successfully!');
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Navigate back to account page
        navigate('/account');
      } else {
        alert(result.error || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error connecting to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-black">
      <h3 className="mb-4 text-center">Change Password</h3>

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            name="currentPassword"
            required
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            required
            minLength="6"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <div className="form-text">Password must be at least 6 characters long</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>

        <div className="text-center mt-3">
          <a href="/account" className="text-decoration-none">Back to Account</a>
        </div>
      </form>
    </div>
  );
}
