import collectionsData from '../mockData/collections.json';

let collections = [...collectionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const collectionService = {
  async getAll() {
    await delay(200);
    return [...collections];
  },

  async getById(id) {
    await delay(150);
    return collections.find(c => c.Id === parseInt(id)) || null;
  },

  async create(collectionData) {
    await delay(300);
    const newCollection = {
      ...collectionData,
      Id: Math.max(...collections.map(c => c.Id)) + 1,
      artworkCount: 0,
      createdAt: new Date().toISOString()
    };
    collections.push(newCollection);
    return newCollection;
  },

  async update(id, collectionData) {
    await delay(250);
    const index = collections.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    collections[index] = {
      ...collections[index],
      ...collectionData,
      Id: parseInt(id)
    };
    
    return collections[index];
  },

  async delete(id) {
    await delay(200);
    const index = collections.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    collections.splice(index, 1);
    return true;
  }
};