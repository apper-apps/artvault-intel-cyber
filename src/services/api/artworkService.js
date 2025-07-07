import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";
import { create, getAll, getById, update } from "@/services/api/userService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const artworkService = {
  async getAll() {
    await delay(300);
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
          { field: { Name: "title" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "date" } },
          { field: { Name: "dimensions_width" } },
          { field: { Name: "dimensions_height" } },
          { field: { Name: "dimensions_depth" } },
          { field: { Name: "dimensions_unit" } },
          { field: { Name: "notes" } },
          { field: { Name: "collection_id" } },
          { field: { Name: "artist_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('artwork', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      return (response.data || []).map(artwork => ({
        Id: artwork.Id,
        title: artwork.title || '',
        mediaUrl: artwork.media_url || '',
        mediaType: artwork.media_type || 'image',
        thumbnailUrl: artwork.thumbnail_url || '',
        date: artwork.date || '',
        dimensions: {
          width: artwork.dimensions_width || 0,
          height: artwork.dimensions_height || 0,
          depth: artwork.dimensions_depth || 0,
          unit: artwork.dimensions_unit || 'inches'
        },
        notes: artwork.notes || '',
        collectionId: artwork.collection_id?.toString() || '',
        owner: artwork.Owner || '',
        createdAt: artwork.CreatedOn || '',
        updatedAt: artwork.ModifiedOn || ''
      }));
    } catch (error) {
      console.error("Error fetching artworks:", error);
      toast.error("Failed to load artworks");
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "date" } },
          { field: { Name: "dimensions_width" } },
          { field: { Name: "dimensions_height" } },
          { field: { Name: "dimensions_depth" } },
          { field: { Name: "dimensions_unit" } },
          { field: { Name: "notes" } },
          { field: { Name: "collection_id" } },
          { field: { Name: "artist_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.getRecordById('artwork', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const artwork = response.data;
      if (!artwork) return null;
      
      return {
        Id: artwork.Id,
        title: artwork.title || '',
        mediaUrl: artwork.media_url || '',
        mediaType: artwork.media_type || 'image',
        thumbnailUrl: artwork.thumbnail_url || '',
        date: artwork.date || '',
        dimensions: {
          width: artwork.dimensions_width || 0,
          height: artwork.dimensions_height || 0,
          depth: artwork.dimensions_depth || 0,
          unit: artwork.dimensions_unit || 'inches'
        },
        notes: artwork.notes || '',
        collectionId: artwork.collection_id?.toString() || '',
        owner: artwork.Owner || '',
        createdAt: artwork.CreatedOn || '',
        updatedAt: artwork.ModifiedOn || ''
      };
    } catch (error) {
      console.error(`Error fetching artwork with ID ${id}:`, error);
      toast.error("Failed to load artwork");
      return null;
    }
  },

  async create(artworkData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const params = {
        records: [{
          title: artworkData.title || '',
          media_url: artworkData.mediaUrl || '',
          media_type: artworkData.mediaType || 'image',
          thumbnail_url: artworkData.thumbnailUrl || '',
          date: artworkData.date || '',
          dimensions_width: parseFloat(artworkData.dimensions?.width) || 0,
          dimensions_height: parseFloat(artworkData.dimensions?.height) || 0,
          dimensions_depth: parseFloat(artworkData.dimensions?.depth) || 0,
          dimensions_unit: artworkData.dimensions?.unit || 'inches',
          notes: artworkData.notes || '',
          collection_id: artworkData.collectionId ? parseInt(artworkData.collectionId) : null,
          artist_id: artworkData.artistId ? parseInt(artworkData.artistId) : null,
          Tags: '',
          Owner: artworkData.owner || ''
        }]
      };
      
      const response = await apperClient.createRecord('artwork', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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
      
      throw new Error('Failed to create artwork');
    } catch (error) {
      console.error("Error creating artwork:", error);
      throw error;
    }
  },

  async update(id, artworkData) {
    await delay(300);
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
          title: artworkData.title || '',
          media_url: artworkData.mediaUrl || '',
          media_type: artworkData.mediaType || 'image',
          thumbnail_url: artworkData.thumbnailUrl || '',
          date: artworkData.date || '',
          dimensions_width: parseFloat(artworkData.dimensions?.width) || 0,
          dimensions_height: parseFloat(artworkData.dimensions?.height) || 0,
          dimensions_depth: parseFloat(artworkData.dimensions?.depth) || 0,
          dimensions_unit: artworkData.dimensions?.unit || 'inches',
          notes: artworkData.notes || '',
          collection_id: artworkData.collectionId ? parseInt(artworkData.collectionId) : null,
          artist_id: artworkData.artistId ? parseInt(artworkData.artistId) : null,
          Tags: '',
          Owner: artworkData.owner || ''
        }]
      };
      
      const response = await apperClient.updateRecord('artwork', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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
      
      throw new Error('Failed to update artwork');
    } catch (error) {
      console.error("Error updating artwork:", error);
      throw error;
    }
  },

  async delete(id) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('artwork', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
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
return true;
    } catch (error) {
      console.error("Error deleting artwork:", error);
      toast.error("Failed to delete artwork");
      return false;
    }

  async getByCollectionId(collectionId) {
    await delay(300);
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
          { field: { Name: "title" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "date" } },
          { field: { Name: "dimensions_width" } },
          { field: { Name: "dimensions_height" } },
          { field: { Name: "dimensions_depth" } },
          { field: { Name: "dimensions_unit" } },
          { field: { Name: "notes" } },
          { field: { Name: "collection_id" } },
          { field: { Name: "artist_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "collection_id",
            Operator: "EqualTo",
            Values: [parseInt(collectionId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('artwork', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      return (response.data || []).map(artwork => ({
        Id: artwork.Id,
        title: artwork.title || '',
        mediaUrl: artwork.media_url || '',
        mediaType: artwork.media_type || 'image',
        thumbnailUrl: artwork.thumbnail_url || '',
        date: artwork.date || '',
        dimensions: {
          width: artwork.dimensions_width || 0,
          height: artwork.dimensions_height || 0,
          depth: artwork.dimensions_depth || 0,
          unit: artwork.dimensions_unit || 'inches'
        },
        notes: artwork.notes || '',
        collectionId: artwork.collection_id?.toString() || '',
        owner: artwork.Owner || '',
        createdAt: artwork.CreatedOn || '',
        updatedAt: artwork.ModifiedOn || ''
      }));
    } catch (error) {
console.error("Error fetching artworks by collection:", error);
      toast.error("Failed to load collection artworks");
      return [];
    }
  }
};