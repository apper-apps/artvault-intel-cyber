import React from 'react';
import { cn } from '@/utils/cn';

const TextArea = React.forwardRef(({ 
  className, 
  label,
  error,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
          'placeholder:text-gray-400 text-gray-900 resize-vertical',
          'transition-all duration-200',
          error && 'border-error focus:ring-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;