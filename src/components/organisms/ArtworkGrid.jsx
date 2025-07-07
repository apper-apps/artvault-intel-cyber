import React from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from '@/components/molecules/ArtworkCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const ArtworkGrid = ({ 
  artworks, 
  loading, 
  error, 
  onArtworkClick, 
  onRetry,
  onAddNew 
}) => {
  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!artworks || artworks.length === 0) {
    return (
      <Empty
        title="No artworks found"
        description="Start building your collection by adding your first artwork"
        actionText="Add Artwork"
        onAction={onAddNew}
        icon="Image"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <ArtworkCard
            artwork={artwork}
            onClick={() => onArtworkClick(artwork)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ArtworkGrid;