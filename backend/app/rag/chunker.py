"""Split page text into overlapping, source-attributed chunks."""

from dataclasses import dataclass
from collections.abc import Sequence

from app.config import CHUNK_OVERLAP, CHUNK_SIZE
from app.rag.loader import PageText


@dataclass(frozen=True)
class TextChunk:
    """A searchable text segment and its PDF source location."""

    text: str
    filename: str
    page: int


def chunk_pages(
    pages: Sequence[PageText],
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[TextChunk]:
    """Create fixed-size chunks while preserving page metadata."""
    if chunk_size <= 0 or overlap < 0 or overlap >= chunk_size:
        raise ValueError("Require chunk_size > overlap >= 0.")

    chunks: list[TextChunk] = []
    step = chunk_size - overlap
    for page in pages:
        text = " ".join(page.text.split())
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunk_text = text[start:end].strip()
            if chunk_text:
                chunks.append(
                    TextChunk(
                        text=chunk_text,
                        filename=page.filename,
                        page=page.page,
                    )
                )
            if end == len(text):
                break
            start += step
    return chunks
