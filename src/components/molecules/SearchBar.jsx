import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ onSearch, placeholder = "Search artworks..." }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
      </div>
      
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 bg-white border-gray-200 focus:border-secondary"
      />
      
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;