import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPanel from '@/components/molecules/FilterPanel';
import ArtworkGrid from '@/components/organisms/ArtworkGrid';
import ArtworkDetail from '@/components/organisms/ArtworkDetail';
import { artworkService } from '@/services/api/artworkService';
import { collectionService } from '@/services/api/collectionService';

const ArtworkGallery = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    collectionId: '',
    owner: '',
    dateFrom: '',
    dateTo: ''
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [artworks, searchQuery, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [artworksData, collectionsData] = await Promise.all([
        artworkService.getAll(),
        collectionService.getAll()
      ]);
      
      setArtworks(artworksData);
      setCollections(collectionsData);
    } catch (err) {
      setError('Failed to load artworks');
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...artworks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply collection filter
    if (filters.collectionId) {
      filtered = filtered.filter(artwork => 
        artwork.collectionId === filters.collectionId
      );
    }

    // Apply owner filter
    if (filters.owner) {
      filtered = filtered.filter(artwork =>
        artwork.owner.toLowerCase().includes(filters.owner.toLowerCase())
      );
    }

    // Apply date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(artwork =>
        new Date(artwork.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(artwork =>
        new Date(artwork.date) <= new Date(filters.dateTo)
      );
    }

    setFilteredArtworks(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      collectionId: '',
      owner: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchQuery('');
  };

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleEditArtwork = () => {
    if (selectedArtwork) {
      navigate(`/edit/${selectedArtwork.Id}`);
    }
  };

  const handleDeleteArtwork = async () => {
    if (!selectedArtwork) return;

    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await artworkService.delete(selectedArtwork.Id);
        setArtworks(prev => prev.filter(a => a.Id !== selectedArtwork.Id));
        setSelectedArtwork(null);
        toast.success('Artwork deleted successfully');
      } catch (error) {
        toast.error('Failed to delete artwork');
      }
    }
  };

  const handleAddNew = () => {
    navigate('/add');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Your Artwork Collection
        </h1>
        <p className="text-gray-600">
          Manage and explore your digital art portfolio
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 flex-shrink-0">
          <div className="space-y-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search your artworks..."
            />
            
            <FilterPanel
              collections={collections}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
          </div>
        </div>

        <div className="flex-1">
          <ArtworkGrid
            artworks={filteredArtworks}
            loading={loading}
            error={error}
            onArtworkClick={handleArtworkClick}
            onRetry={loadData}
            onAddNew={handleAddNew}
          />
        </div>
      </div>

      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onEdit={handleEditArtwork}
          onDelete={handleDeleteArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default ArtworkGallery;