"""Extract text from PDF pages."""

from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader
from pypdf.errors import PdfReadError


class PDFLoadError(RuntimeError):
    """Raised when a PDF cannot be read."""


@dataclass(frozen=True)
class PageText:
    """Text and source metadata for a single PDF page."""

    text: str
    filename: str
    page: int


def load_pdf_pages(pdf_path: Path) -> list[PageText]:
    """Extract non-empty text with one-based page numbers."""
    try:
        reader = PdfReader(str(pdf_path))
        if reader.is_encrypted:
            raise PDFLoadError(f"PDF is encrypted: {pdf_path.name}")
        return [
            PageText(
                text=text,
                filename=pdf_path.name,
                page=page_number,
            )
            for page_number, page in enumerate(reader.pages, start=1)
            if (text := (page.extract_text() or "").strip())
        ]
    except (OSError, PdfReadError, ValueError) as error:
        raise PDFLoadError(f"Unable to read PDF: {pdf_path.name}") from error
