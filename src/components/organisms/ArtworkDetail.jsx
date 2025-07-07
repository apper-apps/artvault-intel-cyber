import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const ArtworkDetail = ({ 
  artwork, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onClose 
}) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <Loading variant="detail" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <Error message={error} variant="minimal" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) return null;

  const formatDimensions = (dims) => {
    if (dims.depth && dims.depth > 0) {
      return `${dims.width} × ${dims.height} × ${dims.depth} ${dims.unit}`;
    }
    return `${dims.width} × ${dims.height} ${dims.unit}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            {artwork.title}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onEdit}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              <span>Delete</span>
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {artwork.mediaType === 'video' ? (
                  <video
                    src={artwork.mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={artwork.mediaUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={artwork.mediaType === 'video' ? 'Play' : 'Image'} 
                  className="w-4 h-4 text-gray-500" 
                />
                <span className="text-sm text-gray-500 capitalize">
                  {artwork.mediaType}
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
                  <p className="text-gray-900">
                    {format(new Date(artwork.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Dimensions</h3>
                  <p className="text-gray-900">{formatDimensions(artwork.dimensions)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Owner</h3>
                  <p className="text-gray-900">{artwork.owner}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Collection</h3>
                  {artwork.collection ? (
                    <Badge color={artwork.collection.color}>
                      {artwork.collection.name}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>
              
              {artwork.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-900 leading-relaxed">{artwork.notes}</p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                <p>Created: {format(new Date(artwork.createdAt), 'MMM d, yyyy HH:mm')}</p>
                <p>Updated: {format(new Date(artwork.updatedAt), 'MMM d, yyyy HH:mm')}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArtworkDetail;