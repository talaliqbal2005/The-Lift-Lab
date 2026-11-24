# The Lift Lab

The Lift Lab is a full-stack gym website that showcases memberships, trainers, equipment, and facilities. It also features an AI-powered assistant that uses Retrieval-Augmented Generation (RAG) to answer questions from the gym's PDF guide.

## Features

- Responsive gym website with animated Home, Trainers, Equipment, Facilities, and Contact pages.
- Membership plans, gym information, and contact links.
- AI chat assistant with PDF-grounded answers and source citations.
- FastAPI endpoints to chat, list and upload PDFs, and rebuild the search index.
- Contact form with client-side validation (demo only; submissions are not sent).

## Technology

React, Vite, Tailwind CSS, Framer Motion, React Router, FastAPI, FastEmbed, NumPy, and Groq.

## RAG assistant

The backend extracts and indexes text from PDFs. For each question, it retrieves relevant passages and sends them to Groq as context for a grounded answer. Responses include source PDF names and page numbers when available.

## Run locally

Requirements: Python 3.10+, Node.js/npm, and a Groq API key.

### Backend

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Add your `GROQ_API_KEY` to `backend/.env`, then run:

```powershell
uvicorn main:app --reload
```

### Frontend

In another terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:8000`; its interactive documentation is at `/docs`.

## Share locally with ngrok

The Vite server is configured for the current hostname `domelike-family-bronzing.ngrok-free.dev` and proxies `/api` requests to the local backend. Start both servers, leave `VITE_API_URL` unset or empty in `frontend/.env` so API calls use the Vite proxy, then run:

```bash
ngrok http 5173
```

Open the HTTPS URL provided by ngrok. If the hostname changes, update `server.allowedHosts` in `frontend/vite.config.js` and restart Vite. The tunnel only works while ngrok and both local servers are running; it exposes a development server and is not a production deployment.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/api/chat` | Ask the gym assistant |
| `GET` | `/api/documents` | List PDF documents |
| `POST` | `/api/upload-pdf` | Upload a PDF and index it |
| `POST` | `/api/ingest` | Rebuild the PDF index |

Place source PDFs in `backend/data/pdfs/`. The backend indexes them at startup.

## Checks

From `frontend/`:

```bash
npm run lint
npm run build
```

Keep API keys in local `.env` files; do not commit secrets.
