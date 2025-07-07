import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    website: '',
    phone: '',
    specialties: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (formData.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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

    setLoading(true);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
        website: formData.website,
        phone: formData.phone,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        experience: '0+ years',
        education: '',
        verified: false
      };

      await register(userData);
      toast.success('Registration successful! Welcome to ArtVault.');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-indigo-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Palette" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">
              ArtVault
            </span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-gray-900">
            Join ArtVault
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your artist account and start managing your artwork
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter your full name"
                autoComplete="name"
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />

              <Input
                label="Website (Optional)"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                error={errors.website}
                placeholder="https://your-website.com"
              />

              <Input
                label="Phone (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
            </div>

            <TextArea
              label="Bio (Optional)"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself and your art..."
              rows={4}
            />

            <Input
              label="Specialties (Optional)"
              value={formData.specialties}
              onChange={(e) => handleInputChange('specialties', e.target.value)}
              placeholder="e.g., Painting, Sculpture, Digital Art (comma-separated)"
              helperText="Separate multiple specialties with commas"
            />

<Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 resize-observer-optimized"
            >
              {loading ? (
                <>
                  <ApperIcon 
                    name="Loader2" 
                    className="w-4 h-4 animate-spin-optimized will-change-transform" 
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <span className="motion-safe">Creating account...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="UserPlus" className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-secondary hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;