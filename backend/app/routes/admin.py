"""Document listing, ingestion, and PDF upload endpoints."""

import logging
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import MAX_UPLOAD_BYTES, PDF_DIR
from app.rag.loader import PDFLoadError
from app.rag.pipeline import ingest_pdfs
from app.schemas import (
    DocumentInfo,
    DocumentsResponse,
    IngestResponse,
    UploadResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["documents"])


@router.post("/ingest", response_model=IngestResponse)
def ingest() -> IngestResponse:
    """Rebuild the searchable index from every stored PDF."""
    try:
        result = ingest_pdfs()
    except PDFLoadError as error:
        logger.exception("PDF ingestion failed.")
        raise HTTPException(
            status_code=422,
            detail="A PDF could not be read. Check the document and try again.",
        ) from error
    return IngestResponse(files=result.files, chunks=result.chunks)


@router.get("/documents", response_model=DocumentsResponse)
def list_documents() -> DocumentsResponse:
    """List PDFs in the configured document directory."""
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    documents = sorted(
        (
            DocumentInfo(filename=path.name, size_bytes=path.stat().st_size)
            for path in PDF_DIR.iterdir()
            if path.is_file() and path.suffix.lower() == ".pdf"
        ),
        key=lambda document: document.filename.casefold(),
    )
    return DocumentsResponse(documents=documents)


@router.post("/upload-pdf", response_model=UploadResponse)
def upload_pdf(file: UploadFile = File(...)) -> UploadResponse:
    """Store a PDF and rebuild the searchable index."""
    filename = (file.filename or "").replace("\\", "/").rsplit("/", maxsplit=1)[-1]
    if not filename or filename in {".", ".."} or Path(filename).suffix.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    content = file.file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The PDF exceeds the configured upload-size limit.",
        )
    if not content.startswith(b"%PDF-"):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid PDF.")

    PDF_DIR.mkdir(parents=True, exist_ok=True)
    destination = PDF_DIR / filename
    try:
        with destination.open("xb") as uploaded_file:
            uploaded_file.write(content)
    except FileExistsError as error:
        raise HTTPException(
            status_code=409,
            detail="A PDF with that filename already exists.",
        ) from error

    try:
        result = ingest_pdfs()
    except PDFLoadError as error:
        destination.unlink(missing_ok=True)
        logger.exception("Uploaded PDF could not be indexed.")
        raise HTTPException(
            status_code=422,
            detail="The PDF could not be read. Check the document and try again.",
        ) from error

    return UploadResponse(
        filename=filename,
        files=result.files,
        chunks=result.chunks,
    )
