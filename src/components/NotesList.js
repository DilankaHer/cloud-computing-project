import Note from "./Note";
import AddNote from "./AddNote";
import EditNote from "./EditNote";
import { Fragment } from "react";

const NotesList = ({
  notes,
  notesFiltered,
  handleAddNote,
  handleDeleteNote,
  handleEditNote,
  handleUpdateNote,
}) => {
  const handleEditNoteChange = (noteId) => {
    let newNotes = notes.map((note) => {
      if (note.noteId == noteId) {
        note.mode = "edit";
      }
      return note;
    });
    handleEditNote(newNotes);
  };

  return (
    <div className="notes-list">
      {notesFiltered.map((note) => (
        <Fragment key={note.noteId}>
          {note.mode != "edit" ? (
            <Note
              noteId={note.noteId}
              text={note.text}
              createDate={note.createDate}
              handleDeleteNote={handleDeleteNote}
              handleEditNote={handleEditNoteChange}
              file={note.image ? note.image : ""}
              imageURL={note.imageURL}
            />
          ) : (
            <EditNote note={note} handleUpdateNote={handleUpdateNote} />
          )}
        </Fragment>
      ))}
      <AddNote handleAddNote={handleAddNote} />
    </div>
  );
};

export default NotesList;
