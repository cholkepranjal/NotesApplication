
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchNotes(query = "") {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/notes?search=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Could not load notes.");
      setNotes(await response.json());
      setError("");
    } catch {
      setError("Unable to connect to the server. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes("");
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and content.");
      return;
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/notes/${editingId}` : `${API_URL}/notes`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) throw new Error("Unable to save note.");

      setTitle("");
      setContent("");
      setEditingId(null);
      setError("");
      await fetchNotes(search);
    } catch {
      setError("Could not save the note. Please try again.");
    }
  }

  function startEditing(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteNote(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete note.");
      await fetchNotes(search);
    } catch {
      setError("Could not delete the note. Please try again.");
    }
  }

  function cancelEditing() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <main className="app">
      <header className="header">
        <h1>My Notes</h1>
        <p>Capture your thoughts. Keep everything organized.</p>
      </header>

      <section className="editor">
        <h2>{editingId ? "Edit Note" : "Create a Note"}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            maxLength={150}
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows={5}
            required
          />

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Note" : "Save Note"}
            </button>
            {editingId && (
              <button type="button" className="cancel-button" onClick={cancelEditing}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="notes-section">
        <div className="notes-heading">
          <h2>Your Notes</h2>
          <input
            className="search"
            aria-label="Search notes"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchNotes(e.target.value);
            }}
            placeholder="Search notes..."
          />
        </div>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading notes...</p>}

        {!loading && notes.length === 0 && (
          <p className="empty">No notes found. Create your first note!</p>
        )}

        <div className="notes-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.id}>
              <h3>{note.title}</h3>
              <p className="note-content">{note.content}</p>
              <small>Created: {note.created_at}</small>
              <div className="note-actions">
                <button type="button" onClick={() => startEditing(note)}>Edit</button>
                <button type="button" className="delete-button" onClick={() => deleteNote(note.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
