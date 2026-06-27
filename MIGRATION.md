# LangChain Migration Guide - Ollama Edition

This document explains the migration from DeepSeek to LangChain with Ollama for your PDF-to-Quiz/Flashcard webapp.

## What Changed

### Architecture Migration
- **Before**: Direct API calls to DeepSeek via axios
- **After**: LangChain with local Ollama LLM and Chroma vector database

### Key Components

1. **LLM Provider**: Ollama (local, self-hosted)
   - Models: mistral, neural-chat, llama2, dolphin-mixtral, etc.
   - Configuration: `server/config/ollama.js`

2. **Vector Store**: Chroma (already configured)
   - Stores PDF embeddings for RAG retrieval
   - Configuration: `server/config/ollama.js`

3. **RAG Pipeline**: 
   - `server/services/rag.service.js` - Retrieval and storage
   - `server/services/pdf.service.js` - PDF processing
   - `server/services/chunk.service.js` - Text chunking
   - `server/services/embedding.service.js` - Embedding pipeline

4. **Generation Services**:
   - `server/services/quiz.service.js` - Quiz generation with LangChain chains
   - `server/services/flashcard.service.js` - Flashcard generation

## Setup Instructions

### 1. Install Ollama
- Download from: https://ollama.ai
- Install and start the Ollama service

### 2. Pull Models
```bash
# Main LLM (choose one)
ollama pull mistral
# or
ollama pull neural-chat
# or
ollama pull llama2

# Embedding model
ollama pull nomic-embed-text
```

### 3. Install Chroma
```bash
# Using pip
pip install chromadb

# Or start Chroma as a service
chroma run --path ./chroma_data --port 8000
```

### 4. Install Dependencies
```bash
cd server
npm install
```

### 5. Configure Environment
Copy `.env.example` to `.env` and update if needed:
```bash
cp .env.example .env
```

### 6. Start Services
```bash
# Terminal 1 - Start Ollama (if not running as service)
# Terminal 2 - Start Chroma
chroma run --path ./chroma_data --port 8000

# Terminal 3 - Start the server
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```
Check if server and Ollama are connected.

### Upload PDF
```
POST /upload
Body: { "filePath": "path/to/pdf.pdf" }
```
Processes a PDF file and stores embeddings in Chroma.

### Generate Quiz
```
GET /quiz?query=important concepts
```
Generates 5 multiple-choice questions based on PDF content.

### Generate Flashcards
```
GET /flashcards?query=key concepts
```
Generates 10 flashcards for studying.

## Configuration Options

### Change LLM Model
Edit `server/config/ollama.js`:
```javascript
export const llm = new Ollama({
  model: "neural-chat", // Change this
  baseUrl: "http://localhost:11434",
  temperature: 0.3,
});
```

### Adjust Chunk Size
Edit `server/services/chunk.service.js`:
```javascript
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,    // Increase for longer context
  chunkOverlap: 300,  // More overlap = more context
});
```

### Adjust Retrieval Results
In `quiz.service.js` and `flashcard.service.js`, change the `topK` parameter:
```javascript
const docs = await retrieveRelevantChunks(query, 8); // Get top 8 chunks
```

## Troubleshooting

### "Ollama is not connected"
- Make sure Ollama is running: `ollama serve`
- Check Chroma URL in `.env`
- Test: `curl http://localhost:11434/api/tags`

### "No relevant content found"
- Ensure PDF was uploaded and processed
- Check Chroma is running: `curl http://localhost:8000/api/v1/heartbeat`
- Verify chunks are stored in Chroma

### Slow Response Times
- Increase `topK` parameter in retrieval
- Use a faster model (mistral vs llama2)
- Increase Ollama thread count

### Out of Memory
- Reduce `chunkSize` in text splitter
- Reduce number of `topK` results
- Use a smaller model

## Performance Optimization

1. **Model Selection**:
   - mistral: Fast, good quality (recommended)
   - neural-chat: Optimized for chat
   - llama2: Larger, better reasoning
   - dolphin-mixtral: Fastest

2. **Embedding Model**:
   - nomic-embed-text: Efficient (1B tokens context)
   - all-minilm: Smaller, faster

3. **Chunk Strategy**:
   - Smaller chunks (500-800) = more retrieval calls but faster
   - Larger chunks (1500-2000) = fewer calls but slower

## Next Steps

1. **File Upload**: Implement multipart form data handling in the upload controller
2. **Frontend Integration**: Connect React frontend to these endpoints
3. **Database**: Consider MongoDB for storing quiz/flashcard history
4. **Authentication**: Add user authentication for multi-user support
5. **Caching**: Add Redis for caching popular queries

## Removed Files
- `server/config/deepseek.js` - No longer needed
- `server/services/deepseek.service.js` - Replaced with LangChain
