import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
  Grid,
} from "@aws-amplify/ui-react";
import { API, Storage } from "aws-amplify";
import { useState, useEffect, Fragment } from "react";
import { nanoid } from "nanoid";
import NotesList from "./components/NotesList";
import Search from "./components/Search";
import Header from "./components/Header";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ signOut }) {
  console.log("hu88ude", signOut);
  const username = localStorage.getItem(
    "CognitoIdentityServiceProvider.hfq4aonhpoq4koknbuliom2ba.LastAuthUser"
  );

  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("notesapi", "/notes/" + username).then(async (response) => {
      console.log("dheiude", response);
      let newNotes = [];
      for (const object of response) {
        if (object.imageURL != "") {
          await Storage.get(username + "/" + object.imageURL)
            .then((resp) => {
              object.image = resp;
            })
            .catch((err) => {
              console.log(err);
            });
        }
        newNotes = [...newNotes, object];
      }
      setNotes(newNotes);
      console.log("newNotes", newNotes);
      setLoading(false);
    });
  }, [username]);

  async function addNote(text, fileInfo) {
    const createDate = new Date();
    const imagePath = fileInfo ? `${fileInfo.target.files[0].name}` : "";
    const imageType = fileInfo ? fileInfo.target.files[0].type : "";
    const noteId = nanoid();
    const urlImg = fileInfo
      ? URL.createObjectURL(fileInfo.target.files[0])
      : "";
    const newNote = {
      noteId: noteId,
      user: username,
      text: text,
      imageURL: imagePath,
      image: urlImg,
      createDate: createDate.toLocaleDateString(),
    };
    const data = {
      body: {
        noteId: noteId,
        user: username,
        text: text,
        imageURL: imagePath,
        createDate: createDate.toLocaleDateString(),
      },
    };
    if (imagePath != "") {
      await Storage.put(username + "/" + imagePath, fileInfo.target.files[0], {
        contentType: imageType,
      }).catch((err) => {
        console.log("hodoe", err);
        return;
      });
    }
    await API.post("notesapi", "/notes", data)
      .then(() => {
        toast.success("Note created successfully!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Outtttttttttttttt");
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
  }

  const deleteNote = async (noteId, imageURL) => {
    console.log("djioids", noteId);
    if (imageURL != "") {
      await Storage.remove(username + "/" + imageURL).catch((err) => {
        console.log("Error", err);
        return;
      });
    }
    await API.del("notesapi", "/notes/object/" + username + "/" + noteId).then(
      (res) => {
        const newNotes = notes.filter((note) => note.noteId !== noteId);
        setNotes(newNotes);
      }
    );
  };

  const handleUpdateNote = async (note, text, fileInfo) => {
    const createDate = new Date();
    let imagePath = "";
    let urlImg = "";
    console.log("jdhid", note, fileInfo);
    if (fileInfo) {
      console.log("jdhidiffffffffffff", note);
      imagePath = fileInfo ? `${fileInfo.target.files[0].name}` : "";
      const imageType = fileInfo ? fileInfo.target.files[0].type : "";
      urlImg = fileInfo ? URL.createObjectURL(fileInfo.target.files[0]) : "";

      if (note.imageURL && note.imageURL != "") {
        await Storage.remove(username + "/" + note.imageURL).catch((err) => {
          console.log("Error", err);
          return;
        });
      }
      await Storage.put(username + "/" + imagePath, fileInfo.target.files[0], {
        contentType: imageType,
      }).catch((err) => {
        console.log("Error", err);
        return;
      });
    }
    const data = {
      body: {
        text: text,
        imageURL: imagePath != "" ? imagePath : note.imageURL,
        createDate: createDate.toLocaleDateString(),
      },
    };
    await API.post(
      "notesapi",
      "/notes/update/" + username + "/" + note.noteId,
      data
    )
      .then((res) => {
        toast.success("Note updated successfully!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => {
        console.log("Error", err);
        return;
      });
    const newNotes = notes.map((newNote) => {
      if (newNote.noteId == note.noteId) {
        newNote.text = text;
        newNote.imageURL = imagePath != "" ? imagePath : note.imageURL;
        newNote.mode = "";
        newNote.createDate = createDate.toLocaleDateString();
        if (urlImg && urlImg != "") {
          newNote.image = urlImg;
        }
        // else if (note.image && note.image != "") {
        //   newNote.image = urlImg;
        // }
      }
      return newNote;
    });
    setNotes(newNotes);
  };

  return (
    <div className={`${darkMode && "dark-mode"}`}>
      <div className="container">
        <Header handleToggleDarkMode={setDarkMode} signOut={signOut} />
        <Search handleSearchNote={setSearchText} />
        {!loading ? (
          <NotesList
            notes={notes.filter((note) =>
              note.text.toLowerCase().includes(searchText.toLowerCase())
            )}
            handleAddNote={addNote}
            handleDeleteNote={deleteNote}
            handleEditNote={setNotes}
            handleUpdateNote={handleUpdateNote}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <CircularProgress color="secondary" />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default withAuthenticator(App);
