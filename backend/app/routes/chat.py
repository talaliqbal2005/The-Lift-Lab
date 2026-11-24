"""Chat endpoint for PDF-grounded gym answers."""

import logging

from fastapi import APIRouter, HTTPException

from app.config import TOP_K
from app.rag.pipeline import has_indexed_chunks, retrieve
from app.schemas import ChatRequest, ChatResponse
from app.services.groq_service import (
    GroqConfigurationError,
    GroqUpstreamError,
    generate_answer,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["chat"])

NO_DOCUMENTS_REPLY = (
    "I don't have gym information available yet. Please check back soon or "
    "contact the gym through the contact page or by phone."
)
GROQ_UNAVAILABLE_REPLY = (
    "The assistant is temporarily unavailable. Please try again later or "
    "contact the gym through the contact page or by phone."
)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """Answer a question using the most relevant PDF passages."""
    if not has_indexed_chunks():
        return ChatResponse(reply=NO_DOCUMENTS_REPLY, sources=[])

    matches = retrieve(request.message, top_k=TOP_K)
    context = [
        {
            "filename": match.chunk.filename,
            "page": match.chunk.page,
            "text": match.chunk.text,
        }
        for match in matches
    ]
    sources = list(
        dict.fromkeys(
            f"{match.chunk.filename} (page {match.chunk.page})"
            for match in matches
        )
    )

    try:
        reply = generate_answer(
            question=request.message,
            history=request.history,
            context=context,
        )
    except GroqConfigurationError as error:
        logger.warning("Chat request rejected because the Groq API key is missing.")
        raise HTTPException(status_code=503, detail=GROQ_UNAVAILABLE_REPLY) from error
    except GroqUpstreamError as error:
        logger.error("Groq chat completion failed.")
        raise HTTPException(status_code=502, detail=GROQ_UNAVAILABLE_REPLY) from error

    return ChatResponse(reply=reply, sources=sources)
