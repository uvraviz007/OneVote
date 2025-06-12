import React, { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    mobile: '',
    adharId: '',
    address: '',
    role: 'voter',
    voted: 'false',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // You can replace this with API call to check uniqueness of adharId etc.
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Signup Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        <label>Name:</label>
        <input type="text" name="name" required value={formData.name} onChange={handleChange} />

        <label>Date of Birth:</label>
        <input type="date" name="dob" required value={formData.dob} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" required value={formData.email} onChange={handleChange} />

        <label>Mobile:</label>
        <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} />

        <label>Aadhar ID:</label>
        <input type="text" name="adharId" required value={formData.adharId} onChange={handleChange} />

        <label>Address:</label>
        <textarea name="address" required value={formData.address} onChange={handleChange} />

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>

        <label>Voted:</label>
        <select name="voted" value={formData.voted} onChange={handleChange}>
          <option value="false">False</option>
          <option value="true">True</option>
        </select>

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f2f2f2',
    borderRadius: '10px',
    fontFamily: 'Arial',
    boxShadow: '0 0 8px rgba(0,0,0,0.2)'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  button: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
