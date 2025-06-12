import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on load
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">One Vote</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vote-count">Vote Count</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/account">Account</Link>
              </li>
            )}
          </ul>

          <div className="ms-auto d-flex gap-2">
            {isLoggedIn ? (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  window.location.reload(); // reload to update navbar
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
