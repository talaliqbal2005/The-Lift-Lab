"""Coordinate PDF ingestion, indexing, and query retrieval."""

import logging
from dataclasses import dataclass
from pathlib import Path
from threading import Lock

import numpy as np

from app.config import MIN_SIMILARITY_SCORE, PDF_DIR
from app.rag.chunker import TextChunk, chunk_pages
from app.rag.embedder import embed_texts
from app.rag.loader import load_pdf_pages
from app.rag.vector_store import (
    IndexStoreError,
    SearchMatch,
    has_indexed_chunks as store_has_indexed_chunks,
    has_saved_index,
    load_index,
    save_index,
    search_index,
    set_index,
)

logger = logging.getLogger(__name__)
_ingest_lock = Lock()


@dataclass(frozen=True)
class IngestResult:
    """Number of source PDFs and chunks in an indexed collection."""

    files: int
    chunks: int


def _pdf_files() -> list[Path]:
    """Return PDF files in a stable order."""
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    return sorted(
        (
            path
            for path in PDF_DIR.iterdir()
            if path.is_file() and path.suffix.lower() == ".pdf"
        ),
        key=lambda path: path.name.casefold(),
    )


def ingest_pdfs() -> IngestResult:
    """Read all PDFs, rebuild embeddings, and persist the index."""
    with _ingest_lock:
        files = _pdf_files()
        pages = [
            page
            for pdf_path in files
            for page in load_pdf_pages(pdf_path)
        ]
        chunks: list[TextChunk] = chunk_pages(pages)
        embeddings = (
            embed_texts([chunk.text for chunk in chunks])
            if chunks
            else np.empty((0, 0), dtype=np.float32)
        )
        save_index(embeddings, chunks)
        set_index(embeddings, chunks)
        logger.info("Indexed %s PDF file(s) into %s chunk(s).", len(files), len(chunks))
        return IngestResult(files=len(files), chunks=len(chunks))


def initialize_index() -> IngestResult:
    """Load a saved index or ingest the current PDF collection."""
    if not _pdf_files():
        logger.info("No PDF files found; initializing an empty knowledge index.")
        return ingest_pdfs()

    if has_saved_index():
        try:
            index = load_index()
        except IndexStoreError:
            logger.warning("Saved index is invalid; rebuilding it from the PDFs.")
        else:
            set_index(index.embeddings, index.chunks)
            files = len(_pdf_files())
            logger.info("Loaded %s saved chunk(s).", len(index.chunks))
            return IngestResult(files=files, chunks=len(index.chunks))
    return ingest_pdfs()


def has_indexed_chunks() -> bool:
    """Return whether the current in-memory index contains PDF text."""
    return store_has_indexed_chunks()


def retrieve(query: str, top_k: int = 4) -> list[SearchMatch]:
    """Retrieve relevant PDF passages, filtering low similarity matches."""
    if not query.strip():
        return []
    if top_k <= 0:
        raise ValueError("top_k must be greater than zero.")

    if not store_has_indexed_chunks():
        return []
    query_embedding = embed_texts([query])[0]
    matches = search_index(query_embedding, top_k)
    return [
        match
        for match in matches
        if match.score >= MIN_SIMILARITY_SCORE
    ]
