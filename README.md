# 🤖 AI RAG Chatbot

An intelligent Retrieval-Augmented Generation (RAG) chatbot powered by Groq's Qwen model. Upload your documents and ask questions to get accurate, context-aware answers.

## ✨ Features

- 📄 **Document Upload** - Support for Text (.txt) and Word (.docx, .doc) files
- 🔍 **Semantic Search** - Find relevant documents using intelligent retrieval
- 🤖 **AI-Powered Q&A** - Get accurate answers using RAG with Groq's Qwen 3.6 27B model
- 💬 **Real-time Chat** - Interactive conversation interface
- 📚 **Document Management** - Upload, view, and delete documents
- 🎨 **Beautiful UI** - Modern, responsive interface with purple gradient design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Groq API key (get it free at https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/Waseem771/ai-rag-chatbot.git
cd ai-rag-chatbot

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Groq API key to .env
# GROQ_API_KEY=your_api_key_here
```

### Running Locally

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Open http://localhost:3000 in your browser.

## 📖 How to Use

1. **Upload a Document**
   - Go to "Documents" panel
   - Choose "Upload File" or "Text Input"
   - Upload your document (text or Word file)

2. **Ask Questions**
   - Type your question in the chat panel
   - Click "Send" or press Enter
   - Get instant answers based on your documents

3. **Manage Documents**
   - View all uploaded documents
   - Delete documents you no longer need

## 🏗️ Architecture

- **Backend:** Node.js + Express
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **AI Model:** Groq's Qwen 3.6 27B (free API)
- **RAG Engine:** Semantic search with embeddings
- **Storage:** JSON-based file system

### Project Structure

```
ai-rag-chatbot/
├── src/
│   ├── api/              # API routes and middleware
│   ├── rag/              # RAG engine (retriever & generator)
│   ├── models/           # Data models
│   ├── utils/            # Utilities (embeddings, storage, etc.)
│   ├── config.js         # Configuration
│   └── index.js          # Server entry point
├── public/
│   └── index.html        # Frontend UI
├── data/                 # Data storage (documents, embeddings)
└── package.json
```

## 🔑 Environment Variables

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=qwen/qwen3.6-27b

# Server Configuration
PORT=3000
NODE_ENV=development

# Storage
DB_PATH=./data/documents.json
EMBEDDINGS_PATH=./data/embeddings.json

# RAG Configuration
MAX_CONTEXT_LENGTH=4000
MAX_TOKENS=2048
TOP_K_RESULTS=5
MIN_SIMILARITY_SCORE=0.3
```

## 📚 API Endpoints

### Documents
- `POST /api/documents` - Upload a document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Chat
- `POST /api/chat` - Send query and get response
- `GET /api/chat/:conversationId` - Get conversation history
- `DELETE /api/chat/:conversationId` - Delete conversation

### Health
- `GET /health` - Server health check

## 🧪 Testing

```bash
npm test
```

## 📝 Example Usage

```bash
# Upload a document
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Document",
    "content": "This is my document content..."
  }'

# Ask a question
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this document about?"}'
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `GROQ_MODEL`: qwen/qwen3.6-27b
6. Deploy!

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation
- Visit Groq console for API support

## 🙏 Acknowledgments

- [Groq](https://groq.com) - Free LLM API
- [Express.js](https://expressjs.com) - Web framework
- [Mammoth.js](https://github.com/mwilson/mammoth.js) - Word document parsing

---

**Made with ❤️ using Groq AI**
