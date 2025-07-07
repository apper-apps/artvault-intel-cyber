import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { collectionService } from '@/services/api/collectionService';

const CollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadCollection();
    }
  }, [id, isEdit]);

  const loadCollection = async () => {
    try {
      setLoading(true);
      setError('');
      
      const collection = await collectionService.getById(id);
      if (collection) {
        setFormData({
          name: collection.name || '',
          description: collection.description || '',
          color: collection.color || '#6366f1'
        });
      } else {
        setError('Collection not found');
      }
    } catch (err) {
      setError('Failed to load collection');
      toast.error('Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const collectionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        artworkCount: 0
      };
      
      if (isEdit) {
        await collectionService.update(id, collectionData);
        toast.success('Collection updated successfully');
      } else {
        await collectionService.create(collectionData);
        toast.success('Collection created successfully');
      }
      
      navigate('/collections');
    } catch (err) {
      toast.error(isEdit ? 'Failed to update collection' : 'Failed to create collection');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const colorOptions = [
    { value: '#6366f1', label: 'Blue', color: '#6366f1' },
    { value: '#10b981', label: 'Green', color: '#10b981' },
    { value: '#f59e0b', label: 'Amber', color: '#f59e0b' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' },
    { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' },
    { value: '#84cc16', label: 'Lime', color: '#84cc16' },
    { value: '#f97316', label: 'Orange', color: '#f97316' }
  ];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={isEdit ? loadCollection : undefined} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Collection' : 'Create New Collection'}
        </h1>
        <p className="text-gray-600">
          {isEdit 
            ? 'Update your collection details and organization' 
            : 'Create a new collection to organize your artworks'
          }
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div>
          <Input
            label="Collection Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter collection name"
            required
          />
        </div>

        <div>
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            placeholder="Describe your collection..."
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Collection Color
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('color', option.value)}
                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                  formData.color === option.value
                    ? 'border-gray-900 shadow-lg scale-110'
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                }`}
                style={{ backgroundColor: option.color }}
                title={option.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/collections')}
            disabled={saving}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex items-center space-x-2"
          >
            {saving && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
            <span>{isEdit ? 'Update Collection' : 'Create Collection'}</span>
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default CollectionForm;