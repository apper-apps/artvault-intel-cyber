import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "No artworks found", 
  description = "Start building your collection by adding your first artwork",
  actionText = "Add Artwork",
  onAction,
  icon = "Image"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-12"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ApperIcon 
          name={icon} 
          className="w-12 h-12 text-gray-400"
        />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="flex items-center space-x-2 px-6 py-3"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>{actionText}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;