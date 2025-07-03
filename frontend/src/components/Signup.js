import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    adharId: '',
    address: '',
    password: '',
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
    setLoading(true);

    try {
      const response = await apiFetch('/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Signup successful! Please login to continue.');
        navigate('/login');
      } else {
        alert(result.error || 'Signup failed! Please try again.');
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
      <h2 className="mb-4 text-center">Signup Form</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-white"
      >
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            className="form-control"
            required
            min="18"
            max="120"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="tel"
            className="form-control"
            name="mobile"
            required
            pattern="[0-9]{10}"
            maxLength="10"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Aadhar ID</label>
          <input
            type="text"
            className="form-control"
            name="adharId"
            required
            pattern="[0-9]{12}"
            maxLength="12"
            value={formData.adharId}
            onChange={handleChange}
            placeholder="Enter 12-digit Aadhar number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            required
            rows="3"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            required
            minLength="6"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <a href="/login" className="text-decoration-none">Login</a>
        </div>
      </form>
    </div>
  );
}
