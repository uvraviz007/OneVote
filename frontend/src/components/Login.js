import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link for navigation

export default function Login() {
  const [formData, setFormData] = useState({
    adharId: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Credentials:', formData);
    // Call backend API here if needed
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

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        {/* ✅ Signup link */}
        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-decoration-none">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
