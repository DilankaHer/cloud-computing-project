import Note from "./Note";
import AddNote from "./AddNote";
import EditNote from "./EditNote";
import { Fragment } from "react";

const NotesList = ({
  notes,
  handleAddNote,
  handleDeleteNote,
  handleEditNote,
  handleUpdateNote,
}) => {
  console.log("jioehidfed", notes);

  const handleEditNoteChange = (noteId) => {
    let newNotes = notes;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].noteId == noteId) {
        newNotes[i].mode = "edit";
        break;
      }
    }
    handleEditNote(newNotes);
    console.log("dhiushdu", notes);
  };

  return (
    <div className="notes-list">
      {notes.map((note) => (
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
