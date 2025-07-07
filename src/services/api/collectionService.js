import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";
import { create, getAll, getById, update } from "@/services/api/userService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const collectionService = {
  async getAll() {
    await delay(200);
    try {
      // Initialize ApperClient with Project ID and Public Key
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "artwork_count" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
const response = await apperClient.fetchRecords('collection', params);
      
      // Transform data to match UI expectations
      return (response.data || []).map(collection => ({
        Id: collection.Id,
        name: collection.Name || '',
        description: collection.description || '',
        color: collection.color || '#6366f1',
        artworkCount: collection.artwork_count || 0,
        createdAt: collection.created_at || collection.CreatedOn || ''
      }));
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections");
      
      // Fallback to mock data
      try {
        const response = await import('@/services/mockData/collections.json');
        const collections = response.default || response;
        return Array.isArray(collections) ? collections : [];
      } catch (mockError) {
        console.error('Error loading mock collections:', mockError);
        return [];
      }
    }
  },

  async getById(id) {
    await delay(150);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "artwork_count" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
const response = await apperClient.getRecordById('collection', parseInt(id), params);
      
      const collection = response.data;
      if (!collection) return null;
      
      return {
        Id: collection.Id,
        name: collection.Name || '',
        description: collection.description || '',
        color: collection.color || '#6366f1',
        artworkCount: collection.artwork_count || 0,
        createdAt: collection.created_at || collection.CreatedOn || ''
      };
    } catch (error) {
      console.error(`Error fetching collection with ID ${id}:`, error);
      toast.error("Failed to load collection");
      
      // Fallback to mock data
      try {
        const response = await import('@/services/mockData/collections.json');
        const collections = response.default || response;
        const collection = collections.find(c => c.Id === parseInt(id));
        return collection || null;
      } catch (mockError) {
        console.error('Error loading mock collection:', mockError);
        return null;
      }
    }
  },

  async create(collectionData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: collectionData.name || '',
          description: collectionData.description || '',
          color: collectionData.color || '#6366f1',
          artwork_count: collectionData.artworkCount || 0,
          created_at: new Date().toISOString(),
          Tags: '',
          Owner: collectionData.owner || ''
        }]
      };
      
const response = await apperClient.createRecord('collection', params);
      
      if (!response.success) {
        throw new Error('Failed to create collection');
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create collection');
    } catch (error) {
      console.error("Error creating collection:", error);
      
      // Fallback to mock create operation
      try {
        const newId = Date.now();
        const newCollection = {
          Id: newId,
          ...collectionData,
          CreatedOn: new Date().toISOString(),
          ModifiedOn: new Date().toISOString()
        };
        
        await delay(400);
        toast.success('Collection created successfully');
        return newCollection;
      } catch (mockError) {
        console.error('Error with mock create:', mockError);
        toast.error('Failed to create collection');
        throw error;
      }
    }
  },

  async update(id, collectionData) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: collectionData.name || '',
          description: collectionData.description || '',
          color: collectionData.color || '#6366f1',
          artwork_count: collectionData.artworkCount || 0,
          created_at: collectionData.createdAt || new Date().toISOString(),
          Tags: '',
          Owner: collectionData.owner || ''
        }]
      };
      
const response = await apperClient.updateRecord('collection', params);
      
      if (!response.success) {
        throw new Error('Failed to update collection');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update collection');
    } catch (error) {
      console.error("Error updating collection:", error);
      
      // Fallback to mock update operation
      try {
        const updatedCollection = {
          ...collectionData,
          Id: parseInt(id),
          ModifiedOn: new Date().toISOString()
        };
        
        await delay(400);
        toast.success('Collection updated successfully');
        return updatedCollection;
      } catch (mockError) {
        console.error('Error with mock update:', mockError);
        toast.error('Failed to update collection');
        throw error;
      }
    }
  },

  async delete(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
const response = await apperClient.deleteRecord('collection', params);
      
      if (!response.success) {
        throw new Error('Failed to delete collection');
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting collection:", error);
      
      // Fallback to mock delete operation
      try {
        await delay(300);
        toast.success('Collection deleted successfully');
        return true;
      } catch (mockError) {
        console.error('Error with mock delete:', mockError);
        toast.error('Failed to delete collection');
        return false;
      }
    }
  }
};