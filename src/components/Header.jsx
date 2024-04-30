import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logohorizontalred.png'; 

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('accessToken') !== null); 
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem('avatarUrl') || 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'); 

  useEffect(() => {
    // Update avatar URL if the user logs in or out
    const updateAvatarUrl = () => {
      if (isLoggedIn) {
        const storedAvatarUrl = localStorage.getItem('avatarUrl');
        if (storedAvatarUrl) {
          setAvatarUrl(storedAvatarUrl);
        }
      } else {
        setAvatarUrl('https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg');
      }
    };

    updateAvatarUrl();

    
    return () => {
      
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false); 
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        
        <Link to="/">
          <img src={logoImg} alt="Logo" className="w-48" />
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="w-24 input input-bordered md:w-auto" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src={avatarUrl} />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              {isLoggedIn ? (
                <a href="#" onClick={handleLogout}>Logout</a>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
