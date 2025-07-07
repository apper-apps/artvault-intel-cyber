import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { collectionService } from '@/services/api/collectionService';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (err) {
      setError('Failed to load collections');
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCollections} />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          title="No collections found"
          description="Collections help organize your artworks by theme, style, or any other criteria"
          actionText="Create Collection"
          onAction={() => toast.info('Collection creation feature coming soon')}
          icon="FolderPlus"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Collections
            </h1>
            <p className="text-gray-600">
              Organize your artworks into meaningful collections
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => toast.info('Collection creation feature coming soon')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Collection</span>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: collection.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {collection.name}
                  </h3>
                </div>
                
                <Badge variant="default">
                  {collection.artworkCount} artwork{collection.artworkCount !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4">
                {collection.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Created {new Date(collection.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.info('Collection editing feature coming soon')}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.info('Collection viewing feature coming soon')}
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Collections;