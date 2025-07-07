import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FileUpload = ({ 
  onFileSelect, 
  accept = "image/*,video/*", 
  label = "Upload Media", 
  multiple = false,
  onProgress = null,
  showProgress = false,
  progress = 0,
  isUploading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
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

const handleFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (multiple) {
      const validFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      
      setFiles(validFiles);
      
      // Generate previews for multiple files
      const previewPromises = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              file,
              preview: e.target.result,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              name: file.name,
              size: file.size
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(previewPromises).then(previews => {
        setFilePreviews(previews);
      });
      
      onFileSelect(validFiles, 'multiple');
    } else {
      const file = selectedFiles[0];
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setFileType(type);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      onFileSelect(file, type);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

const removeFile = (index = null) => {
    if (multiple && index !== null) {
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = filePreviews.filter((_, i) => i !== index);
      setFiles(newFiles);
      setFilePreviews(newPreviews);
      onFileSelect(newFiles, 'multiple');
    } else {
      setPreview(null);
      setFileType(null);
      setFiles([]);
      setFilePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onFileSelect(null, null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
{multiple && filePreviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filePreviews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.preview}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-2">
                  <p className="text-xs truncate">{item.name}</p>
                  <p className="text-xs opacity-75">
                    {(item.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {showProgress && (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {isUploading ? 'Uploading...' : 'Ready to upload'}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (!multiple && preview) ? (
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
            onClick={() => removeFile()}
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
            {multiple ? 'Select multiple images and videos' : 'Images and videos up to 10MB'}
          </p>
        </motion.div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
      />
    </div>
  );
};

export default FileUpload;