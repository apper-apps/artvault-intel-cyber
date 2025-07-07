import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
            <Link to="/add">
              <Button
                variant="primary"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Add Artwork</span>
              </Button>
            </Link>
            
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