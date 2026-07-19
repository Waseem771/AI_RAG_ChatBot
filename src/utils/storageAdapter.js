/**
 * Storage adapter that automatically selects the best storage backend
 * - Local file system for development
 * - Vercel KV (Redis) for Vercel deployments
 * - In-memory fallback for other environments
 */

import fs from 'fs/promises';
import path from 'path';
import config from '../config.js';

let adapter = null;

// Initialize the appropriate storage adapter
export async function initializeStorageAdapter() {
  // Check if running on Vercel with KV enabled
  if (process.env.VERCEL && process.env.KV_URL) {
    console.log('✅ Using Vercel KV Redis for storage');
    adapter = new VercelKVAdapter();
    await adapter.initialize();
  } else if (process.env.VERCEL) {
    console.log('⚠️  Running on Vercel without KV storage - using in-memory storage (data will be lost)');
    console.log('📝 To persist data on Vercel, add Vercel KV to your project');
    adapter = new InMemoryAdapter();
  } else {
    console.log('✅ Using local file system storage');
    adapter = new FileSystemAdapter();
    await adapter.initialize();
  }
}

// Get the current adapter
export function getAdapter() {
  if (!adapter) {
    throw new Error('Storage adapter not initialized. Call initializeStorageAdapter() first.');
  }
  return adapter;
}

/**
 * File System Adapter - for local development
 */
class FileSystemAdapter {
  async initialize() {
    const dataDir = path.dirname(config.dbPath);
    await fs.mkdir(dataDir, { recursive: true });

    // Initialize files if they don't exist
    const dbExists = await this.fileExists(config.dbPath);
    if (!dbExists) {
      await fs.writeFile(config.dbPath, JSON.stringify([], null, 2));
    }

    const embExists = await this.fileExists(config.embeddingsPath);
    if (!embExists) {
      await fs.writeFile(config.embeddingsPath, JSON.stringify({}, null, 2));
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async loadDocuments() {
    try {
      const data = await fs.readFile(config.dbPath, 'utf-8');
      const parsed = JSON.parse(data);
      // Handle both array and nested object format for backward compatibility
      return Array.isArray(parsed) ? parsed : (parsed.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error.message);
      return [];
    }
  }

  async saveDocuments(documents) {
    try {
      const docs = Array.isArray(documents) ? documents : [];
      await fs.writeFile(config.dbPath, JSON.stringify(docs, null, 2));
    } catch (error) {
      console.error('Error saving documents:', error);
      throw error;
    }
  }

  async loadEmbeddings() {
    try {
      const data = await fs.readFile(config.embeddingsPath, 'utf-8');
      const parsed = JSON.parse(data);
      // Handle both direct object and nested format for backward compatibility
      return typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed.embeddings || parsed)
        : {};
    } catch (error) {
      console.error('Error loading embeddings:', error.message);
      return {};
    }
  }

  async saveEmbeddings(embeddings) {
    try {
      const embs = typeof embeddings === 'object' && !Array.isArray(embeddings) ? embeddings : {};
      await fs.writeFile(config.embeddingsPath, JSON.stringify(embs, null, 2));
    } catch (error) {
      console.error('Error saving embeddings:', error);
      throw error;
    }
  }
}

/**
 * In-Memory Adapter - for Vercel without persistent storage
 */
class InMemoryAdapter {
  constructor() {
    this.documents = [];
    this.embeddings = {};
  }

  async initialize() {
    console.log('Initializing in-memory storage...');
  }

  async loadDocuments() {
    return this.documents;
  }

  async saveDocuments(documents) {
    this.documents = Array.isArray(documents) ? documents : [];
  }

  async loadEmbeddings() {
    return this.embeddings;
  }

  async saveEmbeddings(embeddings) {
    this.embeddings = typeof embeddings === 'object' && !Array.isArray(embeddings) ? embeddings : {};
  }
}

/**
 * Vercel KV Adapter - uses Vercel KV (Redis) for persistence
 */
class VercelKVAdapter {
  constructor() {
    this.kv = null;
  }

  async initialize() {
    try {
      const { kv } = await import('@vercel/kv');
      this.kv = kv;
      console.log('Vercel KV adapter initialized');
    } catch (error) {
      throw new Error('Failed to initialize Vercel KV: ' + error.message);
    }
  }

  async loadDocuments() {
    try {
      const data = await this.kv.get('rag:documents');
      if (!data) return [];
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : (parsed.documents || []);
    } catch (error) {
      console.error('Error loading documents from KV:', error);
      return [];
    }
  }

  async saveDocuments(documents) {
    try {
      const docs = Array.isArray(documents) ? documents : [];
      await this.kv.set('rag:documents', JSON.stringify(docs));
    } catch (error) {
      console.error('Error saving documents to KV:', error);
      throw error;
    }
  }

  async loadEmbeddings() {
    try {
      const data = await this.kv.get('rag:embeddings');
      if (!data) return {};
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed.embeddings || parsed)
        : {};
    } catch (error) {
      console.error('Error loading embeddings from KV:', error);
      return {};
    }
  }

  async saveEmbeddings(embeddings) {
    try {
      const embs = typeof embeddings === 'object' && !Array.isArray(embeddings) ? embeddings : {};
      await this.kv.set('rag:embeddings', JSON.stringify(embs));
    } catch (error) {
      console.error('Error saving embeddings to KV:', error);
      throw error;
    }
  }
}

export { FileSystemAdapter, InMemoryAdapter, VercelKVAdapter };
