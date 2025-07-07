import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ message = "Something went wrong", onRetry, variant = 'default' }) => {
  const isMinimal = variant === 'minimal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${
        isMinimal ? 'p-4' : 'p-8'
      }`}
    >
      <div className={`${
        isMinimal ? 'w-12 h-12' : 'w-16 h-16'
      } bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg`}>
        <ApperIcon 
          name="AlertCircle" 
          className={`${isMinimal ? 'w-6 h-6' : 'w-8 h-8'} text-white`}
        />
      </div>
      
      <h3 className={`${
        isMinimal ? 'text-lg' : 'text-xl'
      } font-semibold text-gray-900 mb-2`}>
        Oops! Something went wrong
      </h3>
      
      <p className={`text-gray-600 mb-6 max-w-md ${
        isMinimal ? 'text-sm' : 'text-base'
      }`}>
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Error;