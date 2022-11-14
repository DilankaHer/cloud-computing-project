import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { MdClose, MdCheck, MdDelete, MdDeleteForever } from "react-icons/md";

const EditNote = ({ note, handleUpdateNote }) => {
  const [noteText, setNoteText] = useState(note.text);
  const [fileInfo, setFileInfo] = useState();
  const [imageURL, setImageURL] = useState(note.image ? note.image : "");
  const characterLimit = 200;

  const handleChange = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  };

  const handleSaveClick = () => {
    if (noteText.trim().length > 0) {
      handleUpdateNote(note, noteText, fileInfo, false);
      setNoteText("");
      setImageURL("");
      setFileInfo();
    }
  };

  const handleCancelClick = () => {
    if (noteText.trim().length > 0) {
      handleUpdateNote(note, noteText, fileInfo, true);
      setNoteText("");
      setImageURL("");
      setFileInfo();
    }
  };

  const handleChangeImage = (e) => {
    delete note.action;
    setFileInfo(e);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  const handleDeleteImage = () => {
    note.action = "DELETE";
    setFileInfo();
    setImageURL("");
  };

  return (
    <div id={"div_" + note.noteId} className="note new">
      <TextareaAutosize
        aria-label="empty textarea"
        className="textarea"
        placeholder="Type to add a note..."
        onChange={handleChange}
        value={noteText}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img
          id={"img_" + note.noteId}
          className="resize_fit_center"
          src={imageURL}
        />
        {imageURL != "" ? (
          <MdDelete
            style={{ marginLeft: "10px", verticalAlign: "top" }}
            onClick={() => handleDeleteImage()}
            className="delete-icon"
            size="1.3em"
          />
        ) : (
          ""
        )}
      </div>
      <div className="note-footer">
        <small>{characterLimit - noteText.length} Remaining</small>
        <div>
          <label htmlFor={"input_" + note.noteId}>
            <i>
              <FontAwesomeIcon className="add-image" icon={faCamera} />
            </i>
          </label>
          <input
            type="file"
            id={"input_" + note.noteId}
            style={{ display: "none", visibility: "hidden" }}
            onChange={(e) => handleChangeImage(e)}
            onClick={(e) => (e.target.value = null)}
          />
        </div>
        <a>
          <i>
            <FontAwesomeIcon
              className="close-icon"
              size="lg"
              onClick={() => handleCancelClick()}
              icon={faClose}
            />
          </i>
          <i>
            <FontAwesomeIcon
              className="check-icon"
              style={{ marginLeft: "15px" }}
              icon={faCheck}
              size="lg"
              onClick={() => handleSaveClick()}
            />
          </i>
          {/* <MdClose
            onClick={() => handleCancelClick()}
            className="close-icon"
            size="1.5em"
          />
          <MdCheck
            style={{ marginLeft: "10px" }}
            onClick={() => handleSaveClick()}
            className="check-icon"
            size="1.5em"
          /> */}
        </a>
        {/* <button className="save" onClick={handleSaveClick}>
          Save
        </button> */}
      </div>
    </div>
  );
};

export default EditNote;
