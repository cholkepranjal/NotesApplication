
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="Notes Application API")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = "notes.db"


# Connect to the SQLite database
def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Create the notes table if it does not exist
def initialize_database():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


initialize_database()


# Request model
class NoteCreate(BaseModel):
    title: str
    content: str


# Home route
@app.get("/")
def home():
    return {"message": "Welcome to Notes Application API"}


# Create a note
@app.post("/notes")
def create_note(note: NoteCreate):
    if not note.title.strip() or not note.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Title and content cannot be empty",
        )

    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO notes (title, content) VALUES (?, ?)",
            (note.title.strip(), note.content.strip()),
        )
        note_id = cursor.lastrowid

        row = conn.execute(
            "SELECT * FROM notes WHERE id = ?", (note_id,)
        ).fetchone()

    return dict(row)


# View and search notes
@app.get("/notes")
def get_notes(search: str = ""):
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT * FROM notes
            WHERE title LIKE ? OR content LIKE ?
            ORDER BY id DESC
            """,
            (f"%{search}%", f"%{search}%"),
        ).fetchall()

    return [dict(row) for row in rows]


# Edit a note
@app.put("/notes/{note_id}")
def update_note(note_id: int, note: NoteCreate):
    if not note.title.strip() or not note.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Title and content cannot be empty",
        )

    with get_connection() as conn:
        cursor = conn.execute(
            """
            UPDATE notes
            SET title = ?, content = ?
            WHERE id = ?
            """,
            (note.title.strip(), note.content.strip(), note_id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Note not found",
            )

        row = conn.execute(
            "SELECT * FROM notes WHERE id = ?", (note_id,)
        ).fetchone()

    return dict(row)


# Delete a note
@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    with get_connection() as conn:
        cursor = conn.execute(
            "DELETE FROM notes WHERE id = ?", (note_id,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Note not found",
            )

    return {"message": "Note deleted successfully"}
