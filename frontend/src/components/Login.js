import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation

export default function Login() {
  const [formData, setFormData] = useState({
    adharId: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // navigation hook

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem('token', result.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adharId', formData.adharId);

        console.log('Login successful - localStorage set');
        console.log('Dispatching loginStateChanged event');

        // Dispatch custom event to notify navbar
        window.dispatchEvent(new Event('loginStateChanged'));

        // Check if user is admin by fetching profile
        const profileResponse = await fetch('http://localhost:5000/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${result.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.user && profileData.user.role === 'admin') {
            // Store admin status
            localStorage.setItem('isAdmin', 'true');
            alert('Login successful! Welcome Admin!');
            navigate('/admin-panel');
          } else {
            // Store user status
            localStorage.setItem('isAdmin', 'false');
            alert('Login successful!');
            navigate('/account');
          }
        } else {
          // Fallback to regular user flow
          localStorage.setItem('isAdmin', 'false');
          alert('Login successful!');
          navigate('/account');
        }
      } else {
        alert(result.error || 'Login failed! Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-black">
      <h2 className="mb-4 text-center">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-white"
      >
        <div className="mb-3">
          <label className="form-label">Aadhar ID</label>
          <input
            type="text"
            className="form-control"
            name="adharId"
            pattern="\d{12}"
            maxLength="12"
            required
            value={formData.adharId}
            onChange={handleChange}
            placeholder="Enter 12-digit Aadhar number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-decoration-none">Sign up</a>
        </div>
      </form>
    </div>
  );
}
