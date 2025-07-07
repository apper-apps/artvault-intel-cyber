import artworksData from '../mockData/artworks.json';
import collectionsData from '../mockData/collections.json';

let artworks = [...artworksData];
let collections = [...collectionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const artworkService = {
  async getAll() {
    await delay(300);
    return artworks.map(artwork => ({
      ...artwork,
      collection: collections.find(c => c.Id === parseInt(artwork.collectionId))
    }));
  },

  async getById(id) {
    await delay(200);
    const artwork = artworks.find(a => a.Id === parseInt(id));
    if (!artwork) return null;
    
    return {
      ...artwork,
      collection: collections.find(c => c.Id === parseInt(artwork.collectionId))
    };
  },

  async create(artworkData) {
    await delay(400);
    const newArtwork = {
      ...artworkData,
      Id: Math.max(...artworks.map(a => a.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    artworks.push(newArtwork);
    
    // Update collection artwork count
    const collection = collections.find(c => c.Id === parseInt(artworkData.collectionId));
    if (collection) {
      collection.artworkCount += 1;
    }
    
    return newArtwork;
  },

  async update(id, artworkData) {
    await delay(300);
    const index = artworks.findIndex(a => a.Id === parseInt(id));
    if (index === -1) return null;
    
    const oldCollectionId = artworks[index].collectionId;
    const newCollectionId = artworkData.collectionId;
    
    artworks[index] = {
      ...artworks[index],
      ...artworkData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    // Update collection counts if collection changed
    if (oldCollectionId !== newCollectionId) {
      const oldCollection = collections.find(c => c.Id === parseInt(oldCollectionId));
      const newCollection = collections.find(c => c.Id === parseInt(newCollectionId));
      
      if (oldCollection) oldCollection.artworkCount -= 1;
      if (newCollection) newCollection.artworkCount += 1;
    }
    
    return artworks[index];
  },

  async delete(id) {
    await delay(250);
    const index = artworks.findIndex(a => a.Id === parseInt(id));
    if (index === -1) return false;
    
    const artwork = artworks[index];
    const collection = collections.find(c => c.Id === parseInt(artwork.collectionId));
    if (collection) {
      collection.artworkCount -= 1;
    }
    
    artworks.splice(index, 1);
    return true;
  },

  async searchArtworks(query) {
    await delay(200);
    const searchQuery = query.toLowerCase();
    return artworks.filter(artwork => 
      artwork.title.toLowerCase().includes(searchQuery) ||
      artwork.notes.toLowerCase().includes(searchQuery) ||
      artwork.owner.toLowerCase().includes(searchQuery)
    ).map(artwork => ({
      ...artwork,
      collection: collections.find(c => c.Id === parseInt(artwork.collectionId))
    }));
  },

  async filterArtworks(filters) {
    await delay(200);
    let filteredArtworks = [...artworks];
    
    if (filters.collectionId) {
      filteredArtworks = filteredArtworks.filter(a => a.collectionId === filters.collectionId);
    }
    
    if (filters.owner) {
      filteredArtworks = filteredArtworks.filter(a => 
        a.owner.toLowerCase().includes(filters.owner.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filteredArtworks = filteredArtworks.filter(a => 
        new Date(a.date) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filteredArtworks = filteredArtworks.filter(a => 
        new Date(a.date) <= new Date(filters.dateTo)
      );
    }
    
    return filteredArtworks.map(artwork => ({
      ...artwork,
      collection: collections.find(c => c.Id === parseInt(artwork.collectionId))
    }));
  }
};