"""Create dense text embeddings with a single reusable FastEmbed model."""

from collections.abc import Sequence
from threading import Lock

import numpy as np
from fastembed import TextEmbedding

from app.config import EMBEDDING_MODEL

_model: TextEmbedding | None = None
_model_lock = Lock()


def _get_model() -> TextEmbedding:
    """Load the embedding model once on first use."""
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                _model = TextEmbedding(model_name=EMBEDDING_MODEL)
    return _model


def embed_texts(texts: Sequence[str]) -> np.ndarray:
    """Return a float32 embedding matrix for the provided text."""
    if not texts:
        return np.empty((0, 0), dtype=np.float32)
    vectors = [np.asarray(vector, dtype=np.float32) for vector in _get_model().embed(list(texts))]
    return np.vstack(vectors)
