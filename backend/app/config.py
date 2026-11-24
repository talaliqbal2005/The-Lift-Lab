"""Environment-backed application settings."""

import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")


def _configured_path(name: str, default: Path) -> Path:
    """Resolve a configured path relative to the backend directory."""
    raw_value = os.getenv(name)
    path = Path(raw_value).expanduser() if raw_value else default
    if not path.is_absolute():
        path = BACKEND_DIR / path
    return path.resolve()


def _positive_int(name: str, default: int) -> int:
    """Read a positive integer setting or use its default."""
    value = int(os.getenv(name, str(default)))
    if value <= 0:
        raise ValueError(f"{name} must be greater than zero.")
    return value


DATA_DIR = _configured_path("DATA_DIR", BACKEND_DIR / "data")
PDF_DIR = _configured_path("PDF_DIR", DATA_DIR / "pdfs")
INDEX_DIR = _configured_path("INDEX_DIR", DATA_DIR / "index")
EMBEDDINGS_PATH = INDEX_DIR / "embeddings.npy"
CHUNKS_PATH = INDEX_DIR / "chunks.json"

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = (
    os.getenv("GROQ_MODEL", "openai/gpt-oss-20b").strip()
    or "openai/gpt-oss-20b"
)
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

CHUNK_SIZE = _positive_int("CHUNK_SIZE", 800)
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "150"))
TOP_K = _positive_int("TOP_K", 4)
SIMILARITY_THRESHOLD = float(
    os.getenv(
        "SIMILARITY_THRESHOLD",
        os.getenv("MIN_SIMILARITY_SCORE", "0.58"),
    )
)
MAX_UPLOAD_BYTES = _positive_int("MAX_UPLOAD_BYTES", 20 * 1024 * 1024)

if CHUNK_OVERLAP < 0 or CHUNK_OVERLAP >= CHUNK_SIZE:
    raise ValueError("CHUNK_OVERLAP must be non-negative and smaller than CHUNK_SIZE.")
if not -1.0 <= SIMILARITY_THRESHOLD <= 1.0:
    raise ValueError("SIMILARITY_THRESHOLD must be between -1 and 1.")

_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]
