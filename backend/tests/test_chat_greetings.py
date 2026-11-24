"""Tests for greeting handling in the chat endpoint."""

import unittest
from unittest.mock import patch

from app.config import TOP_K
from app.rag.chunker import TextChunk
from app.rag.vector_store import SearchMatch
from app.routes.chat import GREETING_REPLY, chat
from app.schemas import ChatRequest


class ChatGreetingTests(unittest.TestCase):
    """Verify greetings bypass retrieval and mixed messages do not."""

    def test_simple_greetings_skip_retrieval_and_return_no_sources(self) -> None:
        greetings = ("hi", "hello", "hey", "Hello!", "hey there", "good morning")
        with (
            patch("app.routes.chat.has_indexed_chunks") as has_indexed_chunks,
            patch("app.routes.chat.retrieve") as retrieve,
            patch("app.routes.chat.generate_answer") as generate_answer,
        ):
            for message in greetings:
                with self.subTest(message=message):
                    response = chat(ChatRequest(message=message))

                    self.assertEqual(response.reply, GREETING_REPLY)
                    self.assertEqual(response.sources, [])

            has_indexed_chunks.assert_not_called()
            retrieve.assert_not_called()
            generate_answer.assert_not_called()

    def test_greeting_with_question_uses_rag(self) -> None:
        message = "Hi, what are your membership prices?"
        match = SearchMatch(
            chunk=TextChunk(
                text="Basic: PKR 8,000 per month.",
                filename="the-lift-lab-info.pdf",
                page=2,
            ),
            score=0.9,
        )
        with (
            patch("app.routes.chat.has_indexed_chunks", return_value=True),
            patch("app.routes.chat.retrieve", return_value=[match]) as retrieve,
            patch(
                "app.routes.chat.generate_answer",
                return_value="The Basic plan is PKR 8,000 per month.",
            ) as generate_answer,
        ):
            response = chat(ChatRequest(message=message))

        self.assertEqual(response.reply, "The Basic plan is PKR 8,000 per month.")
        self.assertEqual(response.sources, ["the-lift-lab-info.pdf (page 2)"])
        retrieve.assert_called_once_with(message, top_k=TOP_K)
        self.assertEqual(generate_answer.call_args.kwargs["question"], message)


if __name__ == "__main__":
    unittest.main()
