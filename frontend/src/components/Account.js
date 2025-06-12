import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Account() {
  // Simulated fetched data from API
  const [userData, setUserData] = useState({
    name: 'Ravi Sharma',
    dob: '2002-08-15',
    address: 'MNNIT Allahabad',
    role: 'voter',      // or 'admin'
    voted: false
  });

  

  return (
    <div className="container mt-5 text-black">
      <h2 className="mb-4 text-center">Account Details</h2>
      <form  className="border p-4 rounded bg-white shadow-sm">

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={userData.name} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" value={userData.dob} readOnly />
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
