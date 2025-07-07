import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FileUpload = ({ onFileSelect, accept = "image/*,video/*", label = "Upload Media" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    const type = file.type.startsWith('image/') ? 'image' : 'video';
    setFileType(type);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    onFileSelect(file, type);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null, null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gray-100 rounded-lg overflow-hidden"
        >
          {fileType === 'image' ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          ) : (
            <video
              src={preview}
              className="w-full h-64 object-cover"
              controls
            />
          )}
          
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          animate={{
            borderColor: isDragging ? '#6366f1' : '#d1d5db',
            backgroundColor: isDragging ? '#f8fafc' : '#ffffff'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-secondary hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            <span className="text-secondary font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            Images and videos up to 10MB
          </p>
        </motion.div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;