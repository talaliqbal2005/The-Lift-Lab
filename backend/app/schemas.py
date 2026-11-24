"""Request and response models for the HTTP API."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ChatMessage(BaseModel):
    """A message in the recent conversation history."""

    model_config = ConfigDict(extra="forbid")

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)

    @field_validator("content")
    @classmethod
    def content_must_not_be_blank(cls, value: str) -> str:
        """Reject whitespace-only history messages."""
        value = value.strip()
        if not value:
            raise ValueError("Message content cannot be blank.")
        return value


class ChatRequest(BaseModel):
    """Input payload for the gym assistant."""

    model_config = ConfigDict(extra="forbid")

    message: str = Field(min_length=1, max_length=1000)
    history: list[ChatMessage] = Field(default_factory=list)

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        """Trim the question and reject whitespace-only input."""
        value = value.strip()
        if not value:
            raise ValueError("Message cannot be blank.")
        return value

    @field_validator("history", mode="before")
    @classmethod
    def keep_recent_history(cls, value: object) -> object:
        """Keep only the most recent six history messages."""
        if value is None:
            return []
        if isinstance(value, list):
            return value[-6:]
        return value


class ChatResponse(BaseModel):
    """Assistant response and document citations."""

    reply: str
    sources: list[str]


class DocumentInfo(BaseModel):
    """A PDF available for indexing."""

    filename: str
    size_bytes: int


class DocumentsResponse(BaseModel):
    """The PDFs currently stored for the knowledge base."""

    documents: list[DocumentInfo]


class IngestResponse(BaseModel):
    """Counts for a completed PDF indexing run."""

    files: int
    chunks: int


class UploadResponse(IngestResponse):
    """Index counts and the uploaded PDF name."""

    filename: str
