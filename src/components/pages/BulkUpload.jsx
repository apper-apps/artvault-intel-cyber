import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Button } from '@/atoms/Button';
import { Input } from '@/atoms/Input';
import { Select } from '@/atoms/Select';
import FileUpload from '@/components/molecules/FileUpload';
import ApperIcon from '@/components/ApperIcon';
import { artworkService } from '@/services/api/artworkService';
import { collectionService } from '@/services/api/collectionService';

const BulkUpload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [formData, setFormData] = useState({
    collectionId: '',
    owner: '',
    defaultNotes: ''
  });

  React.useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const collectionsData = await collectionService.getAll();
      setCollections(collectionsData);
    } catch (error) {
      toast.error('Failed to load collections');
    }
  };

  const handleFileSelect = (selectedFiles, type) => {
    if (type === 'multiple' && selectedFiles) {
      setFiles(selectedFiles);
    } else {
      setFiles([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!formData.collectionId || !formData.owner) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Prepare artwork data for each file
      const artworksData = files.map((file, index) => ({
        title: file.name.split('.')[0], // Use filename without extension as title
        mediaUrl: URL.createObjectURL(file), // Simulate file URL
        mediaType: file.type.startsWith('image/') ? 'image' : 'video',
        collectionId: formData.collectionId,
        owner: formData.owner,
        notes: formData.defaultNotes || `Uploaded via bulk upload - ${file.name}`,
        date: new Date().toISOString().split('T')[0], // Today's date
        fileSize: file.size,
        fileName: file.name
      }));

      // Upload with progress tracking
      const results = await artworkService.bulkUpload(artworksData, (progress) => {
        setUploadProgress(progress.progress);
        setCurrentFile(progress.currentFile);
        
        if (progress.error) {
          console.warn(`Upload warning for ${progress.currentFile}:`, progress.error);
        }
      });

      // Show results
      if (results.successful.length > 0) {
        toast.success(`Successfully uploaded ${results.successful.length} artwork(s)`);
      }
      
      if (results.failed.length > 0) {
        toast.error(`Failed to upload ${results.failed.length} artwork(s)`);
      }

      // Navigate to gallery after successful upload
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFile('');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
              <p className="text-gray-600 mt-1">
                Upload multiple artworks at once
              </p>
            </div>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              Back to Gallery
            </Button>
          </div>

          <div className="space-y-6">
            {/* File Upload Section */}
            <div>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*,video/*"
                label="Select Multiple Files"
                multiple={true}
                showProgress={isUploading}
                progress={uploadProgress}
                isUploading={isUploading}
              />
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection *
                </label>
                <Select
                  name="collectionId"
                  value={formData.collectionId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a collection</option>
                  {collections.map(collection => (
                    <option key={collection.Id} value={collection.Id}>
                      {collection.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner *
                </label>
                <Input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  placeholder="Enter owner name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Notes (optional)
                </label>
                <Input
                  type="text"
                  name="defaultNotes"
                  value={formData.defaultNotes}
                  onChange={handleInputChange}
                  placeholder="Enter default notes for all artworks"
                />
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">
                    Uploading: {currentFile}
                  </span>
                  <span className="text-sm text-blue-700">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {/* Upload Summary */}
            {files.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Upload Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Files selected: {files.length}</p>
                  <p>Total size: {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(1)} MB</p>
                  <p>Collection: {collections.find(c => c.Id === parseInt(formData.collectionId))?.name || 'Not selected'}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading || !formData.collectionId || !formData.owner}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Upload" className="w-4 h-4" />
                    Upload {files.length} Artwork{files.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isUploading}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkUpload;