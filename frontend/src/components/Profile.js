import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    fetch('http://localhost:3001/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => { 
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        return res.json();
      })
      .then(data => {
        setUserData(data.user);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load profile");
      });
  }, []);

  if (error) {
    return <div className="container mt-5 text-danger text-center">{error}</div>;
  }

  if (!userData) {
    return <div className="container mt-5 text-center">Loading profile...</div>;
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
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" value={userData.dob?.slice(0, 10)} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea className="form-control" rows="2" value={userData.address} readOnly></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <input type="text" className="form-control" value={userData.role} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Voted</label>
          <input type="text" className="form-control" value={userData.voted ? "Yes" : "No"} readOnly />
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
