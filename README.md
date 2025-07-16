# Prompt Generator

Friday - Prompt Generator is a plug-and-play prompt engineering tool with a React/Vite frontend and a Node.js/Express backend. The backend can connect to any LLM (like Ollama, ChatGPT, etc.) via configurable environment variables.

## Features
- Modern React + Vite frontend
- Backend API for prompt transformation
- Plug-and-play LLM connector (Ollama, ChatGPT, or any API)
- Easily configurable via environment variables

## Getting Started

### 1. Start Ollama (or your LLM)
For Ollama (Llama 3):
```sh
ollama run llama3
```

### 2. Start the Backend
```sh
cd backend
# For Ollama (default):
npm start
# Or explicitly:
LLM_URL=http://localhost:11434/api/generate LLM_MODEL=llama3 LLM_PROVIDER=ollama npm start
# For ChatGPT or other LLMs, set LLM_URL, LLM_MODEL, and LLM_PROVIDER accordingly
```

### 3. Start the Frontend
```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Configuration
- `LLM_URL`: The URL of your LLM API endpoint (default: Ollama)
- `LLM_MODEL`: The model name (default: llama3; set this if you want to use a different model)
- `LLM_PROVIDER`: The provider type (ollama, chatgpt, etc.)

## Example for ChatGPT
```sh
LLM_URL=http://localhost:9090/api/generate LLM_MODEL=gpt-4 LLM_PROVIDER=chatgpt npm start
```

---

For more details, see the code and comments in `backend/src/index.js`.
