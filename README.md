# Tanvir Ahmed portfolio

Static portfolio site with an optional self-hosted, CV-grounded AI assistant.

## Ask Tanvir AI (local LLM + RAG)

The portfolio stays static and can be hosted on GitHub Pages. The assistant UI sends questions to the separate FastAPI backend in `ai-backend/`. The backend retrieves relevant passages from `ai-backend/knowledge/tanvir.md` using local Ollama embeddings, then asks a locally running Ollama model to answer from those passages. No third-party LLM API is used.

This is retrieval augmented generation (RAG), not training a foundation model from scratch. The source material is editable in `ai-backend/knowledge/tanvir.md`; edit it when the CV or portfolio changes.

### Run locally

1. Install [Ollama](https://ollama.com/) on the computer that will host the model, then start it.
2. Download the local chat and embedding models:

   ```sh
   ollama pull qwen2.5:3b
   ollama pull nomic-embed-text
   ```

   `qwen2.5:3b` is a modest default for local use. Set `CHAT_MODEL` in the environment to another Ollama model if your machine can run a larger one.

3. Start the API from the repository root:

   ```sh
   cd ai-backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. Serve the repository root with a local static server (for example `python3 -m http.server 5500`) and open `http://localhost:5500`.

The RAG index is embedded on the first question and cached in backend memory. Restarting the backend rebuilds it from the knowledge file. Ollama must remain running for the chat to answer.

### Deploy

GitHub Pages cannot run Python or host an LLM. For a public assistant, deploy `ai-backend/` and Ollama on an always-on server you control. A Docker Compose setup is provided. It downloads the configured local models, runs the API, and puts Caddy in front to provide HTTPS. The server needs Docker, enough RAM/disk for the model, and a domain you control pointed at the server with ports 80 and 443 reachable.

On that server, copy `ai-backend/.env.example` to `ai-backend/.env`, set `API_DOMAIN` to your API hostname, and set `ALLOWED_ORIGINS=https://tanvir-ahmed98.github.io`. Then run `docker compose up -d --build` from `ai-backend/`.

Before publishing the frontend, set its API URL near the top of `chat.js`, for example:

```js
const API_URL = window.TANVIR_AI_API_URL || 'https://your-api-domain.example/api/chat';
```

Use HTTPS for the public API and allow only your portfolio origin in `ALLOWED_ORIGINS`. Do not expose Ollama's port directly to the public internet; expose the FastAPI service through a TLS reverse proxy and add rate limiting/authentication at that proxy before opening it to unrestricted traffic. The browser widget currently points to `http://localhost:8000`, which is for local development.

The API endpoint is `POST /api/chat` with JSON `{ "question": "...", "history": [] }`; `GET /api/health` reports configured model names.
