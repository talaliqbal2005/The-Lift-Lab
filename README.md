# The Lift Lab backend

This FastAPI service answers gym questions using the PDFs in `data/pdfs/`.
It retrieves relevant passages from those documents and asks Groq to write a
concise answer using only those passages. The PDF index is stored locally in
`data/index/`.

## What is RAG?

Retrieval-Augmented Generation (RAG) gives a language model selected reference
material before it answers. This backend uses RAG so gym details such as prices,
opening times, and facilities come from the supplied PDFs instead of the model's
general knowledge.

## How the RAG pipeline works

1. **Load PDFs:** `pypdf` extracts text page by page and keeps the original
   filename and one-based page number.
2. **Chunk text:** each page is split into approximately 800-character passages
   with 150 characters of overlap. Each passage retains its source metadata.
3. **Create embeddings:** FastEmbed's `BAAI/bge-small-en-v1.5` model converts
   passages and questions into vectors. The model loads only when indexing or
   retrieval needs it.
4. **Save the index:** NumPy vectors are saved as `embeddings.npy`; passage text,
   page details, and PDF file fingerprints are saved in `chunks.json`.
5. **Retrieve passages:** cosine similarity finds up to four passages. Results
   below `SIMILARITY_THRESHOLD` are discarded. If none remain, the API returns
   a fixed “I don't have that information” response without calling Groq.
6. **Generate an answer:** Groq receives the system rules, retrieved excerpts,
   the question, and up to six recent conversation messages. PDF excerpts are
   explicitly treated as reference data, not instructions.

Greeting-only messages such as “hi” or “hello” receive a welcome response before
retrieval, so they do not load embeddings, call Groq, or return PDF sources.
Messages that combine a greeting with a question continue through the normal RAG
workflow.

At startup, a valid index for the current PDF files is loaded. A missing,
outdated, or invalid index is rebuilt. Unreadable PDFs are logged and skipped so
they do not prevent other PDFs from being indexed. The server also starts when
there are no PDFs.

## Project structure

```text
The Lift Lab/
├── README.md
├── frontend/
└── backend/
    ├── main.py
    ├── app/
    │   ├── config.py
    │   ├── schemas.py
    │   ├── routes/
    │   │   ├── chat.py
    │   │   └── admin.py
    │   ├── rag/
    │   │   ├── loader.py
    │   │   ├── chunker.py
    │   │   ├── embedder.py
    │   │   ├── vector_store.py
    │   │   └── pipeline.py
    │   └── services/
    │       └── groq_service.py
    ├── data/
    │   ├── pdfs/
    │   └── index/
    │       ├── chunks.json
    │       └── embeddings.npy
    ├── .env.example
    └── requirements.txt
```

## Environment setup

The existing virtual environment is in the project root. From that directory,
activate it in PowerShell:

```powershell
.\env\Scripts\Activate.ps1
```

If PowerShell prevents activation, run commands with
`.\env\Scripts\python.exe -m ...` instead.

The backend reads configuration from `backend/.env`. If that file does not
exist, create it from the example without replacing an existing configuration:

```powershell
if (-not (Test-Path .\backend\.env)) {
    Copy-Item .\backend\.env.example .\backend\.env
}
```

Set `GROQ_API_KEY` in your local `.env` file. Never commit that file or include
the key in logs, screenshots, or API requests shared with others.

| Variable | Default | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | Empty | API key required for generated answers |
| `GROQ_MODEL` | `openai/gpt-oss-20b` | Groq chat model |
| `CHUNK_SIZE` | `800` | Approximate characters per passage |
| `CHUNK_OVERLAP` | `150` | Characters shared between adjacent passages |
| `TOP_K` | `4` | Maximum retrieved passages |
| `SIMILARITY_THRESHOLD` | `0.58` | Minimum cosine score for a passage to be used |
| `PDF_DIR` | `data/pdfs` | Source PDF directory |
| `INDEX_DIR` | `data/index` | Saved vector index directory |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed frontend origins |
| `MAX_UPLOAD_BYTES` | `20971520` | Optional upload limit (20 MiB) |

Relative paths are resolved from the backend directory. The older
`MIN_SIMILARITY_SCORE` setting is still accepted if `SIMILARITY_THRESHOLD` is
not set.

## Run the backend

From the project root, activate the environment and start the API:

```powershell
cd backend
uvicorn main:app --reload
```

The first ingestion may download the FastEmbed model if it is not already
cached. No additional Python packages are needed beyond those in
`requirements.txt`.

## API endpoints

- `GET /health` returns `{"status":"ok"}`.
- `POST /api/chat` accepts `{"message":"...", "history":[]}` and returns
  `{"reply":"...", "sources":[]}`. Messages must contain 1–1000 characters;
  history is limited to the latest six messages. Greeting-only messages return
  a friendly welcome with no sources and do not call the embedding model or Groq.
- `POST /api/ingest` rebuilds the index from all PDFs.
- `GET /api/documents` lists PDFs and their sizes.
- `POST /api/upload-pdf` accepts a PDF, validates its name and contents, stores
  it under `data/pdfs/`, and rebuilds the index.

## Ingest PDFs

Put each gym-information PDF in `backend/data/pdfs/`. The backend indexes PDFs
automatically at startup. To rebuild after changing a PDF, use Swagger's
`POST /api/ingest` endpoint or run:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/ingest -Method Post
```

The response reports the number of PDF files processed and text chunks created.
Invalid PDFs are logged and skipped; other readable PDFs continue to be
indexed.

## Test with Swagger

Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs), expand an
endpoint, select **Try it out**, enter the request, and select **Execute**.
Check `GET /health`, `GET /api/documents`, and `POST /api/ingest`. For
`POST /api/chat`, use this request body and replace the message with each
question below:

```json
{
  "message": "What are your membership prices?",
  "history": []
}
```

Try these questions:

- Hi
- What are your membership prices?
- What are the women's-only gym timings?
- Who is your head strength coach?
- What equipment do you have?
- What are the sauna timings?
- Do you offer student discounts?
- Is parking available?
- Do you have a swimming pool?

For supported questions, `sources` lists unique PDF filenames and page numbers
from the passages actually used. The swimming-pool question should return the
no-information response with an empty `sources` list if the PDFs do not mention
a pool. A configured Groq API key is needed for answers to questions with
relevant passages; the no-information fallback does not require Groq.

The frontend can call `POST http://localhost:8000/api/chat` with the same JSON
shape. CORS allows both `localhost:5173` and `127.0.0.1:5173` by default.

## Add PDFs with the upload endpoint

Use Swagger's `POST /api/upload-pdf` endpoint and choose a PDF file. The API
rejects non-PDF content, unreadable PDFs, unsafe filenames, duplicate names,
and files larger than `MAX_UPLOAD_BYTES`. You can also copy a PDF into
`data/pdfs/` and call `POST /api/ingest`.

## Troubleshooting

- **Missing Groq key:** set `GROQ_API_KEY` in `backend/.env`. The server starts
  without it, but a relevant chat request returns a friendly service error.
- **Groq connection or model error:** verify network access, the key, and that
  `GROQ_MODEL` is currently available to your Groq account. The API does not
  include credentials or internal tracebacks in client responses.
- **No answer or no sources:** confirm that the information is in an
  extractable PDF, then call `POST /api/ingest`. A question below the similarity
  threshold intentionally receives the no-information response.
- **Unreadable PDF:** check that the PDF opens, is not password-protected, and
  contains extractable text. The filename and error details are logged locally.
- **CORS error:** verify the frontend origin is listed in `CORS_ORIGINS`, then
  restart the backend.
- **Embedding model download fails:** check network access and retry startup;
  FastEmbed caches the model after a successful download.
