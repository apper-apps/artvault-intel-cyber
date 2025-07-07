import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const FilterPanel = ({ 
  collections = [], 
  filters, 
  onFilterChange, 
  onClearFilters,
  isOpen,
  onToggle 
}) => {
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

  const hasActiveFilters = filters.collectionId || filters.owner || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
          <Select
            label="Collection"
            options={collectionOptions}
            value={filters.collectionId || ''}
            onChange={(e) => onFilterChange('collectionId', e.target.value)}
            placeholder="All Collections"
          />
          
          <Select
            label="Owner"
            options={ownerOptions}
            value={filters.owner || ''}
            onChange={(e) => onFilterChange('owner', e.target.value)}
            placeholder="All Owners"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            />
            
            <Input
              label="To Date"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
            />
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="w-full flex items-center space-x-2"
            >
              <ApperIcon name="X" className="w-4 h-4" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FilterPanel;