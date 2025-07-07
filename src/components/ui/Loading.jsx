import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ variant = 'grid' }) => {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-3 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-gradient-to-r from-accent to-secondary rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};

export default Loading;