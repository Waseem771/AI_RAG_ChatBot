import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import documentRoutes from './api/routes/documents.js';
import chatRoutes from './api/routes/chat.js';
import { initializeDataDirectory } from './utils/storage.js';
import { errorHandler, notFoundHandler } from './api/middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize data directory
await initializeDataDirectory();

// API Routes
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '🤖 Welcome to AI RAG Chatbot!',
    version: '3.0.0',
    status: 'running',
    api: 'Groq (Free)',
    features: {
      fileUpload: 'Supports PDF, Word, and Text files',
      embedding: 'Automatic document embedding',
      semanticSearch: 'Find relevant documents',
      chat: 'Multi-turn conversations'
    },
    endpoints: {
      documents: {
        create: 'POST /api/documents (supports file upload)',
        list: 'GET /api/documents',
        get: 'GET /api/documents/:id',
        update: 'PUT /api/documents/:id',
        delete: 'DELETE /api/documents/:id'
      },
      chat: {
        query: 'POST /api/chat',
        history: 'GET /api/chat/:conversationId',
        delete: 'DELETE /api/chat/:conversationId'
      }
    }
  });
});

// 404 handler for API routes
app.use('/api', notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const port = config.port || 3000;
app.listen(port, () => {
  console.log(`🚀 RAG Chatbot v3.0.0 running on http://localhost:${port}`);
  console.log(`🌐 Open http://localhost:${port} in your browser`);
  console.log(`📁 File upload: PDF, Word (.docx), Text files supported`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Model: ${config.groqModel}`);
  console.log(`API Key configured: ${config.groqApiKey ? '✅' : '❌'}`);
});
