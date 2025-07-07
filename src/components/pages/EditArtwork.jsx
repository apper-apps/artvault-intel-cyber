import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ArtworkForm from '@/components/organisms/ArtworkForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { artworkService } from '@/services/api/artworkService';

const EditArtwork = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArtwork();
  }, [id]);

  const loadArtwork = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await artworkService.getById(id);
      if (!data) {
        setError('Artwork not found');
        return;
      }
      
      setArtwork(data);
    } catch (err) {
      setError('Failed to load artwork');
      toast.error('Failed to load artwork');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (artworkData) => {
    setSaving(true);
    try {
      await artworkService.update(id, artworkData);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadArtwork} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Edit Artwork
        </h1>
        <p className="text-gray-600">
          Update your artwork information
        </p>
      </motion.div>

      <ArtworkForm
        artwork={artwork}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  );
};

export default EditArtwork;