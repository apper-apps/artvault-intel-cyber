import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import { useContext } from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-indigo-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Palette" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900">
              ArtVault
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-secondary border-b-2 border-secondary pb-1' 
                  : 'text-gray-700 hover:text-secondary'
              }`}
            >
              Artworks
            </Link>
            
            <Link
              to="/collections"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/collections') 
                  ? 'text-secondary border-b-2 border-secondary pb-1' 
                  : 'text-gray-700 hover:text-secondary'
              }`}
            >
              Collections
            </Link>
          </nav>
          
<div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/add">
                  <Button
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Artwork</span>
                  </Button>
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                    <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ApperIcon name="User" className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <ApperIcon name="LogOut" className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;