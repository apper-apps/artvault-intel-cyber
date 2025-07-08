import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ArtworkCard = ({ artwork, onClick }) => {
  // Early return if artwork is null/undefined to prevent React errors
  if (!artwork || typeof artwork !== 'object') {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="text-gray-500 text-center">Invalid artwork data</div>
      </div>
    );
  }

  const formatDimensions = (dims) => {
    // Enhanced null safety checks for dimensions object
    if (!dims || typeof dims !== 'object') {
      return '';
    }
    
    const width = dims.width || dims.dimensions_width || 0;
    const height = dims.height || dims.dimensions_height || 0;
    const depth = dims.depth || dims.dimensions_depth || 0;
    const unit = dims.unit || dims.dimensions_unit || 'inches';
    
    if (depth && depth > 0) {
      return `${width} × ${height} × ${depth} ${unit}`;
    }
    return `${width} × ${height} ${unit}`;
  };

  // Safe property access with fallbacks
  const title = artwork.title || artwork.Name || 'Untitled';
  const mediaUrl = artwork.media_url || artwork.mediaUrl || '';
  const thumbnailUrl = artwork.thumbnail_url || artwork.thumbnailUrl || mediaUrl;
  const artworkDate = artwork.date || artwork.createdAt || '';
  const notes = artwork.notes || '';
  const ownerName = artwork.Owner?.Name || artwork.owner || '';
  const tags = artwork.Tags || artwork.tags || '';
  const dimensions = artwork.dimensions || null;
  const collection = artwork.collection || null;
  const mediaType = artwork.mediaType || 'image';
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
          <span>{artworkDate ? format(new Date(artworkDate), 'MMM d, yyyy') : 'No date'}</span>
          <span className="text-xs">{formatDimensions(dimensions)}</span>
        </div>
        
<div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 truncate flex-1">{ownerName || 'Unknown'}</span>
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