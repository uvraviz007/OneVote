import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status on load and listen for changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const status = localStorage.getItem("isLoggedIn") === "true";
      const adminStatus = localStorage.getItem("isAdmin") === "true";
      console.log('Navbar checking login status:', status);
      console.log('Navbar checking admin status:', adminStatus);
      setIsLoggedIn(status);
      setIsAdmin(adminStatus);
    };

    // Check initial status
    checkLoginStatus();

    // Listen for storage changes (when login/logout happens in other components)
    const handleStorageChange = (e) => {
      if (e.key === "isLoggedIn" || e.key === "isAdmin") {
        console.log('Storage changed for:', e.key, e.newValue);
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events
    const handleLoginChange = () => {
      console.log('Login state changed event received');
      checkLoginStatus();
    };

    window.addEventListener('loginStateChanged', handleLoginChange);

    // Force check every 2 seconds to catch any missed updates
    const interval = setInterval(checkLoginStatus, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChanged', handleLoginChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
    // Clear all stored data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("adharId");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('loginStateChanged'));
    
    navigate('/');
  };

  // Debug: Log current state
  console.log('Navbar render - isLoggedIn:', isLoggedIn);
  console.log('Navbar render - isAdmin:', isAdmin);
  console.log('Navbar render - localStorage isLoggedIn:', localStorage.getItem("isLoggedIn"));
  console.log('Navbar render - localStorage isAdmin:', localStorage.getItem("isAdmin"));

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">One Vote</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {(location.pathname === '/login' || location.pathname === '/signup') ? (
            <div className="ms-auto">
              <Link className="btn btn-secondary" to="/">
                Home
              </Link>
            </div>
          ) : isLoggedIn ? (
            <>
              <ul className="navbar-nav">
                {!isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/vote-count">Vote Count</Link>
                    </li>
                  </>
                )}
                {isLoggedIn && !isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/account">Account</Link>
                  </li>
                )}
                {isLoggedIn && isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-panel">Admin Panel</Link>
                  </li>
                )}
              </ul>
              <div className="ms-auto d-flex gap-2">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="ms-auto">
              <Link className="btn btn-primary" to="/signup">
                Let's register yourself to vote
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
