import React, { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    adharId: '',
    address: '',
    password: '',
    role: 'voter',
    voted: 'false',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3001/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || 'Signup successful!');
      // Optional: redirect user to login
      // navigate('/login');
    } else {
      alert(result.message || 'Signup failed!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error connecting to the server');
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
            min="1"
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
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Aadhar ID</label>
          <input
            type="text"
            className="form-control"
            name="adharId"
            required
            value={formData.adharId}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            required
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
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Voted</label>
          <select
            className="form-select"
            name="voted"
            value={formData.voted}
            onChange={handleChange}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
