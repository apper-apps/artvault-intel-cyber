import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';
import FileUpload from '@/components/molecules/FileUpload';
import { collectionService } from '@/services/api/collectionService';

const ArtworkForm = ({ artwork, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    mediaUrl: '',
    mediaType: 'image',
    thumbnailUrl: '',
    date: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
      unit: 'inches'
    },
    owner: '',
    collectionId: '',
    notes: ''
  });

  const [collections, setCollections] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        mediaUrl: artwork.mediaUrl || '',
        mediaType: artwork.mediaType || 'image',
        thumbnailUrl: artwork.thumbnailUrl || '',
        date: artwork.date || '',
        dimensions: artwork.dimensions || {
          width: '',
          height: '',
          depth: '',
          unit: 'inches'
        },
        owner: artwork.owner || '',
        collectionId: artwork.collectionId || '',
        notes: artwork.notes || ''
      });
    }
  }, [artwork]);

  const loadCollections = async () => {
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (error) {
      toast.error('Failed to load collections');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!selectedFile && !formData.mediaUrl) {
      newErrors.media = 'Media file is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.dimensions.width || !formData.dimensions.height) {
      newErrors.dimensions = 'Width and height are required';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      let mediaUrl = formData.mediaUrl;
      let thumbnailUrl = formData.thumbnailUrl;

      if (selectedFile) {
        // In a real app, you would upload the file here
        // For now, we'll use a placeholder URL
        mediaUrl = URL.createObjectURL(selectedFile);
        thumbnailUrl = URL.createObjectURL(selectedFile);
      }

      const submissionData = {
        ...formData,
        mediaUrl,
        thumbnailUrl,
        dimensions: {
          ...formData.dimensions,
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height),
          depth: formData.dimensions.depth ? parseFloat(formData.dimensions.depth) : 0
        }
      };

      await onSubmit(submissionData);
      toast.success(artwork ? 'Artwork updated successfully' : 'Artwork created successfully');
    } catch (error) {
      toast.error('Failed to save artwork');
    }
  };

  const handleFileSelect = (file, type) => {
    setSelectedFile(file);
    if (file) {
      setFormData(prev => ({ ...prev, mediaType: type }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDimensionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: value }
    }));
    if (errors.dimensions) {
      setErrors(prev => ({ ...prev, dimensions: '' }));
    }
  };

  const collectionOptions = collections.map(collection => ({
    value: collection.Id.toString(),
    label: collection.name
  }));

  const ownerOptions = [
    { value: 'Personal Collection', label: 'Personal Collection' },
    { value: 'Available for Sale', label: 'Available for Sale' },
    { value: 'Johnson Gallery', label: 'Johnson Gallery' },
    { value: 'Miller Collection', label: 'Miller Collection' },
    { value: 'Digital Archive', label: 'Digital Archive' },
  ];

  const unitOptions = [
    { value: 'inches', label: 'Inches' },
    { value: 'cm', label: 'Centimeters' },
    { value: 'pixels', label: 'Pixels' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-semibold text-gray-900">
          {artwork ? 'Edit Artwork' : 'Add New Artwork'}
        </h2>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="p-2"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="Enter artwork title"
            />

            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*,video/*"
              label="Media File"
            />
            {errors.media && (
              <p className="text-sm text-error">{errors.media}</p>
            )}

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={errors.date}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Width"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                />
                <Input
                  placeholder="Height"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                />
                <Input
                  placeholder="Depth"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.depth}
                  onChange={(e) => handleDimensionChange('depth', e.target.value)}
                />
              </div>
              <div className="mt-2">
                <Select
                  options={unitOptions}
                  value={formData.dimensions.unit}
                  onChange={(e) => handleDimensionChange('unit', e.target.value)}
                />
              </div>
              {errors.dimensions && (
                <p className="text-sm text-error mt-1">{errors.dimensions}</p>
              )}
            </div>

            <Select
              label="Owner"
              options={ownerOptions}
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              error={errors.owner}
              placeholder="Select owner"
            />

            <Select
              label="Collection"
              options={collectionOptions}
              value={formData.collectionId}
              onChange={(e) => handleInputChange('collectionId', e.target.value)}
              placeholder="Select collection (optional)"
            />
          </div>
        </div>

        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any notes about this artwork..."
          rows={4}
        />

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="w-4 h-4" />
                <span>{artwork ? 'Update' : 'Create'} Artwork</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ArtworkForm;