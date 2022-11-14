import { MdDeleteForever, MdEditNote } from "react-icons/md";

const Note = ({
  noteId,
  text,
  createDate,
  handleDeleteNote,
  handleEditNote,
  file,
  imageURL,
}) => {
  console.log("IUnnnnOteeee");
  return (
    <div className="note">
      <span>{text}</span>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img className="resize_fit_center" src={file} />
      </div>
      <div className="note-footer">
        <small>{createDate}</small>
        <MdEditNote
          onClick={() => handleEditNote(noteId)}
          className="edit-icon"
          size="1.3em"
        />
        <MdDeleteForever
          onClick={() => handleDeleteNote(noteId, imageURL)}
          className="delete-icon"
          size="1.3em"
        />
      </div>
    </div>
  );
};

export default Note;
