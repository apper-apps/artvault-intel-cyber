import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-secondary to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-secondary',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md',
    accent: 'bg-gradient-to-r from-accent to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-accent',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-error',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;