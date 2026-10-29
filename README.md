# Tanvir Ahmed portfolio

Static portfolio site with a private, browser-based AI assistant. The primary GitHub Pages setup does not need a VPS, FastAPI server, API key, or third-party LLM API.

The site includes a CV section with the resume PDF at `assets/Tanvir_Ahmed_Resume.pdf`. Python-related answers distinguish the CV's 5+ years of overall software engineering experience from any Python-specific duration, which the CV does not state.

## Ask Tanvir AI

The chat runs RAG in the visitor's browser:

1. It downloads the Qwen3-0.6B WebLLM model on the visitor's first question and caches model files in the browser.
2. It retrieves relevant passages from `ai-backend/knowledge/tanvir.txt` with local BM25 scoring.
3. It sends the selected passages and question to the local WebGPU model. The question and retrieved CV text stay in the browser.

WebLLM JavaScript is loaded from `esm.run`, while model files are downloaded from Hugging Face. Those are runtime/model file downloads, not LLM API calls. The model is approximately 352 MB; the first download may take a few minutes and later visits can reuse the browser cache. A WebGPU-capable desktop browser is required. If WebGPU is unavailable or the device does not have enough GPU memory, the chat reports that instead of calling a remote model.

The CV knowledge source is `ai-backend/knowledge/tanvir.txt`. Update it when the resume or portfolio changes. Retrieval is lexical BM25 with English, Bangla, and Banglish query aliases; answer quality depends on the compact local model and relevant retrieved passages.

## Run locally

Serve the repository root over HTTP(S), for example:

```sh
python3 -m http.server 5500
```

Then open `http://localhost:5500` in a browser with WebGPU enabled and ask a question. No Python AI backend is used by the page.

## Optional self-hosted backend

`ai-backend/` also contains a FastAPI + Ollama deployment for a future always-on VPS setup. The GitHub Pages frontend currently uses browser inference and does not call that backend.
