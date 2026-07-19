import { getAdapter, initializeStorageAdapter } from './storageAdapter.js';

// Initialize storage adapter on module load
export async function initializeDataDirectory() {
  await initializeStorageAdapter();
}

// Load documents from storage
export async function loadDocuments() {
  const adapter = getAdapter();
  return await adapter.loadDocuments();
}

// Save documents to storage
export async function saveDocuments(documents) {
  const adapter = getAdapter();
  await adapter.saveDocuments(documents);
}

// Load embeddings from storage
export async function loadEmbeddings() {
  const adapter = getAdapter();
  return await adapter.loadEmbeddings();
}

// Save embeddings to storage
export async function saveEmbeddings(embeddings) {
  const adapter = getAdapter();
  await adapter.saveEmbeddings(embeddings);
}
