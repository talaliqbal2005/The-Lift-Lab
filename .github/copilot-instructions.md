Project: "The Lift Lab" gym website, monorepo with two folders.
- backend/: Python 3.10+, FastAPI, RAG chatbot over PDFs, Groq API.
- frontend/: React (Vite, JavaScript), Tailwind CSS, React Router, Framer Motion, lucide-react, axios.
Theme: yellow (#FACC15) and black (#0A0A0A) only. Professional, premium, animated.
Frontend runs at http://localhost:5173, backend at http://localhost:8000.
Chat API: POST /api/chat with {message, history} returning {reply, sources}.
Rules: small reusable components, content in src/data files, responsive and accessible, comments for beginners, no secrets in code.