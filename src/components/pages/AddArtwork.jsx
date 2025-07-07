import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArtworkForm from '@/components/organisms/ArtworkForm';
import { artworkService } from '@/services/api/artworkService';

const AddArtwork = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (artworkData) => {
    setLoading(true);
    try {
      await artworkService.create(artworkData);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Add New Artwork
        </h1>
        <p className="text-gray-600">
          Create a new entry for your artwork collection
        </p>
      </motion.div>

      <ArtworkForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default AddArtwork;