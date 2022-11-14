import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "@mui/base/TextareaAutosize";

const AddNote = ({ handleAddNote }) => {
  console.log("innnnnnnnnnnnnnnnAddddd");
  const [noteText, setNoteText] = useState("");
  const [fileInfo, setFileInfo] = useState();
  const [imageURL, setImageURL] = useState();
  const characterLimit = 200;

  const handleChange = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  };

  const handleSaveClick = () => {
    if (noteText.trim().length > 0) {
      handleAddNote(noteText, fileInfo);
      setNoteText("");
      setImageURL();
      setFileInfo();
    }
  };

  const handleChangeImage = (e) => {
    setFileInfo(e);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="note new">
      <TextareaAutosize
        aria-label="empty textarea"
        className="textarea"
        placeholder="Type to add a note..."
        onChange={handleChange}
        value={noteText}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img className="resize_fit_center" src={imageURL} />
      </div>
      <div className="note-footer">
        <small>{characterLimit - noteText.length} Remaining</small>
        <div>
          <label htmlFor={`img`}>
            <i>
              <FontAwesomeIcon className="add-image" icon={faCamera} />
            </i>
          </label>
          <input
            type="file"
            id={`img`}
            style={{ display: "none", visibility: "hidden" }}
            onChange={(e) => handleChangeImage(e)}
          />
        </div>
        <button className="save" onClick={handleSaveClick}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddNote;
