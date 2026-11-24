# The Lift Lab backend

This FastAPI service answers gym questions using passages retrieved from PDFs in
`data/pdfs/`. The first run builds a local FastEmbed index; later runs load the
saved index from `data/index/`. The Groq API is used only to write an answer
from the retrieved PDF passages.

## 1. Activate the virtual environment

From the project root, activate the existing environment:

```powershell
.\env\Scripts\Activate.ps1
```

If PowerShell blocks activation, use the Python executable directly for the
commands below, or use `.\env\Scripts\activate.bat` from Command Prompt.

## 2. Configure the Groq API

The backend reads `backend/.env`. Copy `.env.example` to `.env` if needed, then
set `GROQ_API_KEY` to your own key. Do not commit `.env`. The example model and
CORS origins are already provided in `.env.example`.

## 3. Run the server

```powershell
cd backend
uvicorn main:app --reload
```

On its first run, FastEmbed downloads the `BAAI/bge-small-en-v1.5` model if it
is not already cached. The PDFs are then indexed automatically.

## 4. Open the API docs

Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in a browser.
You can also check [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health).

## 5. Test `/api/chat` with three questions

Run each command in PowerShell while the server is running:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/chat -Method Post -ContentType "application/json" -Body '{"message":"What are the membership prices?","history":[]}'
```

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/chat -Method Post -ContentType "application/json" -Body '{"message":"What are the sauna timings?","history":[]}'
```

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/chat -Method Post -ContentType "application/json" -Body '{"message":"Who are the trainers and what do they specialize in?","history":[]}'
```

Each response contains a `reply` and a `sources` list with PDF filenames and
page numbers. Answers are restricted to the indexed PDFs.

## Other endpoints

- `POST /api/ingest` rebuilds the index from all stored PDFs.
- `GET /api/documents` lists the PDFs available for indexing.
- `POST /api/upload-pdf` accepts a PDF upload and rebuilds the index.

If no PDFs are present, the server still starts and `/api/chat` explains that
gym information is not available yet. A missing Groq key or a Groq API failure
returns a friendly error response without exposing credentials.
