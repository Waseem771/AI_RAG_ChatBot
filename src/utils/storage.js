import fs from 'fs/promises';
import path from 'path';
import config from '../config.js';

// In-memory storage for Vercel (serverless has no persistent file system)
let documentsCache = null;
let embeddingsCache = null;

// Ensure data directory exists (for local development only)
export async function initializeDataDirectory() {
  try {
    // In Vercel, skip file initialization - use in-memory storage
    if (process.env.VERCEL) {
      console.log('Running on Vercel - using in-memory storage');
      documentsCache = [];
      embeddingsCache = {};
      return;
    }

    const dataDir = path.dirname(config.dbPath);
    await fs.mkdir(dataDir, { recursive: true });

    // Initialize files if they don't exist
    const dbExists = await fileExists(config.dbPath);
    if (!dbExists) {
      await fs.writeFile(config.dbPath, JSON.stringify([], null, 2));
    }
    
    const embExists = await fileExists(config.embeddingsPath);
    if (!embExists) {
      await fs.writeFile(config.embeddingsPath, JSON.stringify({}, null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize data directory:', error);
    // Don't throw - allow in-memory storage as fallback
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Load documents from storage
export async function loadDocuments() {
  try {
    // Use in-memory cache if available (Vercel)
    if (process.env.VERCEL && documentsCache) {
      return Array.isArray(documentsCache) ? documentsCache : [];
    }

    // Try file storage (local development)
    try {
      const data = await fs.readFile(config.dbPath, 'utf-8');
      const parsed = JSON.parse(data);
      // Handle both array and nested object format
      const docs = Array.isArray(parsed) ? parsed : (parsed.documents || []);
      return docs;
    } catch {
      // Fallback to in-memory if file doesn't exist
      if (!documentsCache) {
        documentsCache = [];
      }
      return Array.isArray(documentsCache) ? documentsCache : [];
    }
  } catch (error) {
    console.error('Error loading documents:', error);
    if (!documentsCache) {
      documentsCache = [];
    }
    return Array.isArray(documentsCache) ? documentsCache : [];
  }
}

// Save documents to storage
export async function saveDocuments(documents) {
  try {
    // Save to in-memory cache
    documentsCache = Array.isArray(documents) ? documents : [];

    // Try to save to file (local development)
    if (!process.env.VERCEL) {
      try {
        await fs.writeFile(config.dbPath, JSON.stringify(documents, null, 2));
      } catch (error) {
        console.warn('Could not save to file, using in-memory storage:', error.message);
      }
    }
  } catch (error) {
    console.error('Error saving documents:', error);
    throw error;
  }
}

// Load embeddings from storage
export async function loadEmbeddings() {
  try {
    // Use in-memory cache if available (Vercel)
    if (process.env.VERCEL && embeddingsCache) {
      return typeof embeddingsCache === 'object' ? embeddingsCache : {};
    }

    // Try file storage (local development)
    try {
      const data = await fs.readFile(config.embeddingsPath, 'utf-8');
      const parsed = JSON.parse(data);
      // Handle both direct object and nested format
      const embs = typeof parsed === 'object' && !Array.isArray(parsed) 
        ? (parsed.embeddings || parsed) 
        : {};
      return embs;
    } catch {
      // Fallback to in-memory if file doesn't exist
      if (!embeddingsCache) {
        embeddingsCache = {};
      }
      return typeof embeddingsCache === 'object' ? embeddingsCache : {};
    }
  } catch (error) {
    console.error('Error loading embeddings:', error);
    if (!embeddingsCache) {
      embeddingsCache = {};
    }
    return typeof embeddingsCache === 'object' ? embeddingsCache : {};
  }
}

// Save embeddings to storage
export async function saveEmbeddings(embeddings) {
  try {
    // Save to in-memory cache - store as plain object, not nested
    embeddingsCache = typeof embeddings === 'object' ? embeddings : {};

    // Try to save to file (local development)
    if (!process.env.VERCEL) {
      try {
        await fs.writeFile(config.embeddingsPath, JSON.stringify(embeddings, null, 2));
      } catch (error) {
        console.warn('Could not save to file, using in-memory storage:', error.message);
      }
    }
  } catch (error) {
    console.error('Error saving embeddings:', error);
    throw error;
  }
}
