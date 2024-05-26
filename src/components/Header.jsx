import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logohorizontalred.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('accessToken') !== null);
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem('avatarUrl') || 'https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const storedAvatarUrl = localStorage.getItem('avatarUrl');
      if (storedAvatarUrl) {
        setAvatarUrl(storedAvatarUrl);
      } else {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const apiKey = localStorage.getItem('apiKey');
          const username = localStorage.getItem('username');

          if (accessToken && apiKey && username) {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Noroff-API-Key': apiKey,
              },
            });

            if (response.ok) {
              const data = await response.json();
              const newAvatarUrl = data.data.avatar.url;
              setAvatarUrl(newAvatarUrl);
              localStorage.setItem('avatarUrl', newAvatarUrl);
            }
          }
        } catch (error) {
          console.error('Failed to fetch avatar URL:', error);
        }
      }
    };

    fetchAvatarUrl();
  }, [isLoggedIn]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutConfirmation(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        <Link to="/" className="p-4">
          <img src={logoImg} alt="Logo" className="object-contain w-48 min-w-44 lg:w-52" />
        </Link>
      </div>
      <div className="hidden shadow-lg rounded-3xl navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
          <li><Link to="/login" className="hover:text-primary">Login</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src={avatarUrl} />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a href="#" onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <p className="mb-4 text-lg">Are you sure you want to log out?</p>
            <div className="flex justify-center">
              <button className="px-4 py-2 mr-4 text-white bg-red-600 rounded-3xl" onClick={confirmLogout}>Yes, Log out</button>
              <button className="px-4 py-2 text-gray-800 bg-gray-300 rounded-3xl" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
