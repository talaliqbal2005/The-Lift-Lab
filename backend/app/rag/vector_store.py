"""Persist and search the local NumPy vector index."""

import json
import logging
import os
from dataclasses import dataclass
from threading import RLock
from collections.abc import Sequence

import numpy as np

from app.config import CHUNKS_PATH, EMBEDDINGS_PATH, INDEX_DIR
from app.rag.chunker import TextChunk

logger = logging.getLogger(__name__)


class IndexStoreError(RuntimeError):
    """Raised when a saved vector index is missing or invalid."""


@dataclass(frozen=True)
class VectorIndex:
    """Embedding rows aligned with their source text chunks."""

    embeddings: np.ndarray
    chunks: tuple[TextChunk, ...]


@dataclass(frozen=True)
class SearchMatch:
    """A chunk and its cosine similarity score."""

    chunk: TextChunk
    score: float


_index_lock = RLock()
_current_index = VectorIndex(np.empty((0, 0), dtype=np.float32), ())


def has_saved_index() -> bool:
    """Return whether either saved index file exists."""
    return EMBEDDINGS_PATH.exists() or CHUNKS_PATH.exists()


def has_indexed_chunks() -> bool:
    """Return whether at least one source chunk is available."""
    with _index_lock:
        return bool(_current_index.chunks)


def _validate_index(embeddings: np.ndarray, chunks: Sequence[TextChunk]) -> None:
    """Validate embedding and metadata alignment."""
    if embeddings.ndim != 2 or embeddings.shape[0] != len(chunks):
        raise ValueError("The embedding matrix and chunk metadata do not align.")
    if not np.isfinite(embeddings).all():
        raise ValueError("The embedding matrix contains non-finite values.")


def set_index(embeddings: np.ndarray, chunks: Sequence[TextChunk]) -> None:
    """Atomically replace the in-memory index snapshot."""
    _validate_index(embeddings, chunks)
    snapshot = VectorIndex(
        embeddings=np.asarray(embeddings, dtype=np.float32),
        chunks=tuple(chunks),
    )
    with _index_lock:
        global _current_index
        _current_index = snapshot


def save_index(embeddings: np.ndarray, chunks: Sequence[TextChunk]) -> None:
    """Write embeddings and metadata to the configured index directory."""
    _validate_index(embeddings, chunks)
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    embedding_temp = EMBEDDINGS_PATH.with_name(EMBEDDINGS_PATH.name + ".tmp")
    chunks_temp = CHUNKS_PATH.with_name(CHUNKS_PATH.name + ".tmp")
    try:
        with embedding_temp.open("wb") as file:
            np.save(file, embeddings, allow_pickle=False)
        metadata = [
            {"text": chunk.text, "filename": chunk.filename, "page": chunk.page}
            for chunk in chunks
        ]
        chunks_temp.write_text(
            json.dumps(metadata, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        os.replace(embedding_temp, EMBEDDINGS_PATH)
        os.replace(chunks_temp, CHUNKS_PATH)
    except OSError:
        logger.exception("Could not save the vector index.")
        raise
    finally:
        embedding_temp.unlink(missing_ok=True)
        chunks_temp.unlink(missing_ok=True)


def load_index() -> VectorIndex:
    """Load and validate the saved NumPy matrix and chunk metadata."""
    try:
        with EMBEDDINGS_PATH.open("rb") as file:
            embeddings = np.load(file, allow_pickle=False)
        raw_chunks = json.loads(CHUNKS_PATH.read_text(encoding="utf-8"))
        chunks = tuple(TextChunk(**item) for item in raw_chunks)
        _validate_index(embeddings, chunks)
    except (OSError, ValueError, TypeError, KeyError) as error:
        raise IndexStoreError("The saved vector index is missing or invalid.") from error
    return VectorIndex(embeddings=np.asarray(embeddings, dtype=np.float32), chunks=chunks)


def search_index(query_embedding: np.ndarray, top_k: int) -> list[SearchMatch]:
    """Return the highest-scoring chunks by cosine similarity."""
    if top_k <= 0:
        raise ValueError("top_k must be greater than zero.")
    with _index_lock:
        index = _current_index
    if not index.chunks:
        return []

    query = np.asarray(query_embedding, dtype=np.float32).reshape(-1)
    if query.size != index.embeddings.shape[1]:
        raise ValueError("Query and document embeddings have different dimensions.")

    query_norm = np.linalg.norm(query)
    row_norms = np.linalg.norm(index.embeddings, axis=1)
    denominators = row_norms * query_norm
    scores = np.full(len(index.chunks), -1.0, dtype=np.float32)
    valid_rows = denominators > 0
    scores[valid_rows] = (
        index.embeddings[valid_rows] @ query
    ) / denominators[valid_rows]
    best_indices = np.argsort(scores)[::-1][:top_k]
    return [
        SearchMatch(chunk=index.chunks[int(index_number)], score=float(scores[index_number]))
        for index_number in best_indices
        if scores[index_number] >= -1.0
    ]
