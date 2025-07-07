import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const ArtworkCard = ({ artwork, onClick }) => {
  // Safe destructuring with fallback values to prevent null/undefined errors
  const {
    title = '',
    thumbnailUrl = '',
    date = null,
    dimensions = null,
    owner = '',
    collection = null,
    mediaType = 'image'
  } = artwork || {};

  const formatDimensions = (dims) => {
    // Add null safety checks for dimensions object
    if (!dims || typeof dims !== 'object') {
      return '';
    }
    
    const width = dims.width || 0;
    const height = dims.height || 0;
    const depth = dims.depth || 0;
    const unit = dims.unit || 'inches';
    
    if (depth && depth > 0) {
      return `${width} × ${height} × ${depth} ${unit}`;
    }
    return `${width} × ${height} ${unit}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="aspect-[3/2] relative overflow-hidden bg-gray-100">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ApperIcon 
              name={mediaType === 'video' ? 'Play' : 'Image'} 
              className="w-4 h-4 text-white" 
            />
          </div>
        </div>
      </div>
      
<div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {title}
        </h3>
        
<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{date ? format(new Date(date), 'MMM d, yyyy') : 'No date'}</span>
          <span className="text-xs">{formatDimensions(dimensions)}</span>
        </div>
        
<div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 truncate flex-1">{owner || 'Unknown'}</span>
          {collection && collection.name && (
            <Badge color={collection.color || 'gray'} className="ml-2 flex-shrink-0">
              {collection.name}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;