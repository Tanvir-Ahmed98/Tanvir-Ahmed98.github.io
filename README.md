# Tanvir Ahmed portfolio

Static portfolio site with a Gemini-powered portfolio assistant.

The site includes a CV section with the resume PDF at `assets/Tanvir_Ahmed_Resume.pdf`. Python-related answers distinguish the CV's 5+ years of overall software engineering experience from any Python-specific duration, which the CV does not state.

## Ask Tanvir AI

The chat retrieves relevant passages from `ai-backend/knowledge/tanvir.txt` (BM25, in the browser) and sends them with the question to a Cloudflare Worker (`gemini-proxy/`), which calls Gemini. The Gemini API key lives only as a Worker secret (`wrangler secret put GEMINI_API_KEY`); it is never in this repo. The Worker only accepts requests from the site origin and is pinned to a US region because Gemini rejects some Cloudflare edge locations. Deploy with `cd gemini-proxy && npx wrangler deploy`.

## Run locally

Serve the repository root over HTTP(S), for example:

```sh
python3 -m http.server 5500
```

Then open `http://localhost:5500` in a browser with WebGPU enabled and ask a question. No Python AI backend is used by the page.

## Optional self-hosted backend

`ai-backend/` also contains a FastAPI + Ollama deployment for a future always-on VPS setup. The GitHub Pages frontend currently uses browser inference and does not call that backend.
