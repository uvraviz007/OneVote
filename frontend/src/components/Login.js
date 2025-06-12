import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation

export default function Login() {
  const [formData, setFormData] = useState({
    adharId: '',
    password: ''
  });

  const navigate = useNavigate(); // navigation hook

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation (simulated)
    if (formData.adharId.length === 12 && formData.password.length > 0) {
      // ✅ Save login status
      localStorage.setItem("isLoggedIn", "true");

      // Optionally: store Aadhar ID or role
      localStorage.setItem("adharId", formData.adharId);

      alert("Login successful!");

      // ✅ Redirect to account page
      navigate('/account');
    } else {
      alert("Invalid Aadhar ID or Password");
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

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-decoration-none">Sign up</a>
        </div>
      </form>
    </div>
  );
}
