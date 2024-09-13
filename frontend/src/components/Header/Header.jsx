import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../assets/StreamUp.svg';
import LogoutBtn from './LogoutBtn';

// Custom Button component
const Button = ({ children, onClick, className = '', variant = 'default' }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Custom Dropdown component
const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

function Header({ onSearch }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [searchQuery, setSearchQuery] = useState('');

  const avatar = userData?.avatar || '';
  const fullName = userData?.fullName || 'User';

  const navLinks = [
    {
      name: 'Explore',
      link: '/videos',
      active: authStatus,
    },
    {
      name: 'Login',
      link: '/login',
      active: !authStatus,
    },
    {
      name: 'Register',
      link: '/signup',
      active: !authStatus,
    },
  ];

  const handleProfileClick = () => {
    if (userData) {
      navigate(`/user-dashboard`);
    } else {
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="StreamUp Logo" className="h-8 w-auto" />
        </Link>

        <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </form>

        <nav className="flex items-center space-x-4">
          {navLinks.map(
            (item) =>
              item.active && (
                <Button key={item.name} variant="ghost" onClick={() => navigate(item.link)}>
                  {item.name}
                </Button>
              )
          )}

          {authStatus && (
            <Dropdown
              trigger={
                <button className="relative h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-600 flex items-center justify-center text-white">
                      {fullName.charAt(0)}
                    </div>
                  )}
                </button>
              }
            >
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                onClick={handleProfileClick}
              >
                Dashboard
              </button>
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <LogoutBtn />
              </div>
            </Dropdown>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;