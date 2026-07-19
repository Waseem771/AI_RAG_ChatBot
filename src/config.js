import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const config = {
  // Server
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Groq API Configuration
  groqApiKey: process.env.GROQ_API_KEY,

  // Models - Use correct current model
  groqModel: process.env.GROQ_MODEL || 'qwen/qwen3.6-27b',

  // Paths
  dbPath: process.env.DB_PATH || path.join(__dirname, '../data/documents.json'),
  embeddingsPath: process.env.EMBEDDINGS_PATH || path.join(__dirname, '../data/embeddings.json'),

  // RAG Configuration
  maxContextLength: parseInt(process.env.MAX_CONTEXT_LENGTH) || 4000,
  maxTokens: parseInt(process.env.MAX_TOKENS) || 2048,
  topKResults: parseInt(process.env.TOP_K_RESULTS) || 5,
  minSimilarityScore: parseFloat(process.env.MIN_SIMILARITY_SCORE) || 0.3,
};

// Validation
if (!config.groqApiKey) {
  console.warn('⚠️  GROQ_API_KEY environment variable is not set. RAG queries will fail.');
  console.warn('Please add GROQ_API_KEY to your Vercel environment variables or .env file.');
}

export default config;
