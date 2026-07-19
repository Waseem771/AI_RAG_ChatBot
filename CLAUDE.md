# AI RAG Chatbot - Project Documentation

## Overview

This is a Node.js-based Retrieval-Augmented Generation (RAG) chatbot that combines document retrieval with Claude API for intelligent question answering.

## Architecture

### Core Components

1. **RAG Engine** (`src/rag/`)
   - `retriever.js`: Handles semantic search and document ranking
   - `generator.js`: Manages Claude API calls for response generation

2. **API Layer** (`src/api/`)
   - `routes/documents.js`: CRUD operations for documents
   - `routes/chat.js`: Conversation and query endpoints
   - `middleware/errorHandler.js`: Centralized error handling

3. **Utilities** (`src/utils/`)
   - `embeddings.js`: Vector similarity and ranking algorithms
   - `storage.js`: File-based persistence layer

4. **Data Models** (`src/models/`)
   - `document.js`: Document creation and validation
   - `conversation.js`: Conversation management

## Key Flows

### Document Upload
1. User POSTs document to `/api/documents`
2. Document is validated
3. Simple embedding is generated
4. Document and embedding are persisted to disk

### Query Processing
1. User sends query to `/api/chat`
2. Query is embedded using the same algorithm
3. Cosine similarity ranks stored documents
4. Top-K documents are retrieved
5. Context is built from retrieved documents
6. Claude generates response with the context
7. Messages are stored in conversation history

## Configuration

See `.env.example` for all environment variables:
- `ANTHROPIC_API_KEY`: Required for Claude API access
- `MODEL_ID`: Claude model to use (default: claude-opus-4-8)
- `TOP_K_RESULTS`: Number of documents to retrieve per query
- `MIN_SIMILARITY_SCORE`: Filtering threshold for document relevance

## Storage

Data is stored as JSON files in the `data/` directory:
- `documents.json`: All documents with metadata
- `embeddings.json`: Vector embeddings mapped by document ID

### File Structure

```
data/
├── documents.json      # [{id, title, content, metadata, createdAt, updatedAt}]
└── embeddings.json     # {"docId": [0.1, 0.2, ...], ...}
```

## Embedding Strategy

Currently uses a simple hash-based embedding:
- 384 dimensions
- Generated from document title + content
- Deterministic but not semantically sophisticated

**Future Enhancement**: Replace with Claude's embedding API for better semantic understanding.

## API Endpoints

### Documents
- `POST /api/documents` - Create document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Chat
- `POST /api/chat` - Send query, get response with RAG
- `GET /api/chat/:conversationId` - Get conversation history
- `DELETE /api/chat/:conversationId` - Delete conversation

### Health
- `GET /health` - Server health check

## Running the Project

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY

# Start server
npm start

# Or watch mode for development
npm run dev

# Run tests
npm test

# Regenerate embeddings
npm run embeddings
```

## Testing

Tests are located in `tests/` and use Node's built-in test runner:

```bash
npm test
```

Test coverage includes:
- Embedding similarity calculations
- Document validation
- Conversation management
- Model creation

## Example Usage

See `examples/basic-usage.js` for a complete example:

```bash
node examples/basic-usage.js
```

This demonstrates:
1. Uploading documents
2. Retrieving documents
3. Querying with RAG
4. Managing conversations
5. Updating and deleting documents

## Limitations

1. **Simple Embeddings**: Hash-based embeddings lack semantic sophistication
2. **In-Memory Conversations**: Conversation state is lost on server restart
3. **Single Server**: No multi-instance support
4. **No Authentication**: All endpoints are public
5. **File-Based Storage**: Not suitable for production at scale
6. **No Rate Limiting**: Vulnerable to abuse

## Future Improvements

- [ ] PostgreSQL with pgvector for production-grade storage
- [ ] Claude embedding API for semantic similarity
- [ ] Hybrid search combining keyword and semantic search
- [ ] Multi-modal document support (PDF, images)
- [ ] Web UI dashboard
- [ ] Authentication and authorization
- [ ] Rate limiting and quota management
- [ ] Monitoring and logging
- [ ] Caching layer for frequently accessed documents
- [ ] Document chunking for large files
- [ ] User feedback and ranking improvement

## Development Notes

- Uses ES modules (`"type": "module"` in package.json)
- Node 18+ recommended
- Requires ANTHROPIC_API_KEY for full functionality
- Tests use Node's built-in test runner (no external framework)
