"""Coordinate PDF ingestion, indexing, and query retrieval."""

import logging
from dataclasses import dataclass
from pathlib import Path
from threading import Lock

import numpy as np

from app.config import PDF_DIR, SIMILARITY_THRESHOLD
from app.rag.chunker import TextChunk, chunk_pages
from app.rag.embedder import embed_texts
from app.rag.loader import PDFLoadError, PageText, load_pdf_pages
from app.rag.vector_store import (
    IndexStoreError,
    SearchMatch,
    SourceFile,
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


def _source_files(files: list[Path]) -> tuple[SourceFile, ...]:
    """Capture file metadata so startup can detect stale indexes."""
    sources = []
    for path in files:
        try:
            file_stat = path.stat()
        except OSError:
            logger.warning(
                "Could not inspect PDF metadata for %s.",
                path.name,
                exc_info=True,
            )
            sources.append(SourceFile(path.name, -1, -1))
        else:
            sources.append(
                SourceFile(
                    filename=path.name,
                    size_bytes=file_stat.st_size,
                    modified_ns=file_stat.st_mtime_ns,
                )
            )
    return tuple(sources)


def _readable_pdf_pages(files: list[Path]) -> list[PageText]:
    """Load pages from readable PDFs while logging failures per file."""
    pages: list[PageText] = []
    for pdf_path in files:
        try:
            pages.extend(load_pdf_pages(pdf_path))
        except PDFLoadError:
            logger.warning(
                "Skipping unreadable PDF %s during ingestion.",
                pdf_path.name,
                exc_info=True,
            )
    return pages


def ingest_pdfs() -> IngestResult:
    """Read all PDFs, rebuild embeddings, and persist the index."""
    with _ingest_lock:
        files = _pdf_files()
        sources = _source_files(files)
        pages = _readable_pdf_pages(files)
        chunks: list[TextChunk] = chunk_pages(pages)
        embeddings = (
            embed_texts([chunk.text for chunk in chunks])
            if chunks
            else np.empty((0, 0), dtype=np.float32)
        )
        save_index(embeddings, chunks, sources)
        set_index(embeddings, chunks, sources)
        logger.info("Indexed %s PDF file(s) into %s chunk(s).", len(files), len(chunks))
        return IngestResult(files=len(files), chunks=len(chunks))


def initialize_index() -> IngestResult:
    """Load a saved index or ingest the current PDF collection."""
    files = _pdf_files()
    if not files:
        logger.info("No PDF files found; initializing an empty knowledge index.")
        return ingest_pdfs()

    sources = _source_files(files)
    if has_saved_index():
        try:
            index = load_index()
        except IndexStoreError:
            logger.warning("Saved index is invalid; rebuilding it from the PDFs.")
        else:
            if index.sources == sources:
                set_index(index.embeddings, index.chunks, index.sources)
                logger.info("Loaded %s saved chunk(s).", len(index.chunks))
                return IngestResult(files=len(files), chunks=len(index.chunks))
            logger.info("Saved index is out of date; rebuilding it from the PDFs.")
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
    normalized_query = query.casefold()
    asks_about_price = any(
        term in normalized_query
        for term in ("price", "cost", "fee", "how much")
    )
    asks_about_membership = any(
        term in normalized_query
        for term in ("membership", "plan", "basic", "pro", "elite")
    )
    retrieval_query = (
        f"{query} membership plans Basic Pro Elite monthly rates"
        if asks_about_price and asks_about_membership
        else query
    )
    query_embedding = embed_texts([retrieval_query])[0]
    matches = search_index(query_embedding, top_k)
    return [
        match
        for match in matches
        if match.score >= SIMILARITY_THRESHOLD
    ]
