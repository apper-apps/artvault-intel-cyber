import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ArtworkGrid from '@/components/organisms/ArtworkGrid';
import { collectionService } from '@/services/api/collectionService';
import { artworkService } from '@/services/api/artworkService';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [collection, setCollection] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCollectionData();
  }, [id]);

  const loadCollectionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load collection details and artworks in parallel
      const [collectionData, artworkData] = await Promise.all([
        collectionService.getById(id),
        artworkService.getByCollectionId(id)
      ]);
      
      if (collectionData) {
        setCollection(collectionData);
        setArtworks(artworkData || []);
      } else {
        setError('Collection not found');
      }
    } catch (err) {
      setError('Failed to load collection');
      toast.error('Failed to load collection');
    } finally {
      setLoading(false);
      setArtworksLoading(false);
    }
  };

  const handleArtworkClick = (artwork) => {
    // You can navigate to artwork detail or open a modal
    console.log('Clicked artwork:', artwork);
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
        <Error message={error} onRetry={loadCollectionData} />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Collection not found" />
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
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/collections')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Collections</span>
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: collection.color }}
              />
              <h1 className="text-3xl font-display font-bold text-gray-900">
                {collection.name}
              </h1>
              <Badge variant="default">
                {artworks.length} artwork{artworks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-4 max-w-2xl">
              {collection.description}
            </p>
            
            <div className="text-sm text-gray-500">
              Created {new Date(collection.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/collections/edit/${collection.Id}`)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              <span>Edit Collection</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Artworks in this Collection
          </h2>
        </div>

        {artworks.length === 0 ? (
          <Empty
            title="No artworks in this collection"
            description="This collection doesn't contain any artworks yet. Add artworks to this collection to see them here."
            actionText="Add Artwork"
            onAction={() => navigate('/add')}
            icon="Plus"
          />
        ) : (
          <ArtworkGrid
            artworks={artworks}
            loading={artworksLoading}
            error=""
            onArtworkClick={handleArtworkClick}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CollectionDetail;