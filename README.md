# Notes Application

A full-stack Notes Application developed as part of the CodeNova Full Stack Development Internship.

## Features

- Create and save notes
- View all saved notes
- Edit existing notes
- Search notes by title or content
- Delete notes with confirmation
- Store notes persistently using SQLite
- Responsive user interface
- Error handling for failed requests

## Technologies Used

- **Frontend:** React, Vite, HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Database:** SQLite
- **API:** REST API

## Project Structure

```text
NotesApplication/
├── backend/
│   ├── main.py
│   ├── start.bat
│   └── notes.db
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── README.md
```

## Requirements

- Python 3.11 or compatible version
- Node.js and npm

## How to Run the Application

### 1. Start the Backend

Open a terminal in the `backend` folder and run:

```powershell
.\start.bat
```

The FastAPI backend runs at:

http://127.0.0.1:8000

API documentation is available at:

http://127.0.0.1:8000/docs

### 2. Start the Frontend

Open a second terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually:

http://localhost:5173

## How to Use

1. Enter a title and content to create a note.
2. Click **Save Note**.
3. Use the search box to find notes.
4. Click **Edit** to update a note.
5. Click **Delete** to remove a note.

## Database

The application uses SQLite to store notes, including their titles, content, and creation timestamps.

## Author

Developed as part of the CodeNova Full Stack Development Internship.