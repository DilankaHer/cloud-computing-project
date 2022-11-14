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
  const username = localStorage.getItem(
    "CognitoIdentityServiceProvider.hfq4aonhpoq4koknbuliom2ba.LastAuthUser"
  );

  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("notesapi", "/notes/" + username).then(async (response) => {
      let newNotes = [];
      for (const object of response) {
        if (object.imageURL != "") {
          await Storage.get(
            username + "/" + object.noteId + "/" + object.imageURL
          )
            .then((resp) => {
              object.image = resp;
            })
            .catch((err) => {
              console.log("Error", err);
            });
        }
        newNotes = [...newNotes, object];
      }
      setNotes(newNotes);
      setLoading(false);
    });
  }, [username]);

  async function addNote(text, fileInfo) {
    const createDate = new Date();
    const noteId = nanoid();
    const fileName = fileInfo ? `${fileInfo.target.files[0].name}` : "";
    const imageType = fileInfo ? fileInfo.target.files[0].type : "";
    const urlImg = fileInfo
      ? URL.createObjectURL(fileInfo.target.files[0])
      : "";
    const newNote = {
      body: {
        noteId: noteId,
        user: username,
        text: text,
        imageURL: fileName,
        image: urlImg,
        createDate: createDate.toLocaleDateString(),
      },
    };
    if (fileName != "") {
      await Storage.put(
        username + "/" + noteId + "/" + fileName,
        fileInfo.target.files[0],
        {
          contentType: imageType,
        }
      ).catch((err) => {
        console.log("Error", err);
        return;
      });
    }
    await API.post("notesapi", "/notes", newNote)
      .then(() => {
        toast.success("Note created successfully!", {
          position: toast.POSITION.TOP_CENTER,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
      })
      .catch((err) => {
        console.log("Error", err);
        return;
      });
    const newNotes = [...notes, newNote.body];
    setNotes(newNotes);
  }

  const deleteNote = async (noteId, fileName) => {
    if (fileName != "") {
      await Storage.remove(username + "/" + noteId + "/" + fileName).catch(
        (err) => {
          console.log("Error", err);
          return;
        }
      );
    }
    await API.del("notesapi", "/notes/object/" + username + "/" + noteId).catch(
      (err) => {
        console.log("Error", err);
        return;
      }
    );
    const newNotes = notes.filter((note) => note.noteId !== noteId);
    setNotes(newNotes);
  };

  const handleUpdateNote = async (note, text, fileInfo, isCancel) => {
    if (!isCancel) {
      const createDate = new Date();
      let fileName = "";
      let urlImg = "";
      if (fileInfo || note.action == "DELETE") {
        fileName = fileInfo ? `${fileInfo.target.files[0].name}` : "";
        const imageType = fileInfo ? fileInfo.target.files[0].type : "";
        urlImg = fileInfo ? URL.createObjectURL(fileInfo.target.files[0]) : "";

        await Storage.remove(
          username + "/" + note.noteId + "/" + note.imageURL
        ).catch((err) => {
          console.log("Error", err);
          return;
        });
        if (fileInfo) {
          await Storage.put(
            username + "/" + note.noteId + "/" + fileName,
            fileInfo.target.files[0],
            {
              contentType: imageType,
            }
          ).catch((err) => {
            console.log("Error", err);
            return;
          });
        }
      }
      const data = {
        body: {
          text: text,
          imageURL:
            fileName != ""
              ? fileName
              : note.action == "DELETE"
              ? ""
              : note.imageURL,
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
            pauseOnHover: false,
            pauseOnFocusLoss: false,
          });
        })
        .catch((err) => {
          console.log("Error", err);
          return;
        });
      const newNotes = notes.map((newNote) => {
        if (newNote.noteId == note.noteId) {
          newNote.text = text;
          newNote.imageURL =
            fileName != ""
              ? fileName
              : note.action == "DELETE"
              ? ""
              : note.imageURL;
          delete newNote.mode;
          newNote.createDate = createDate.toLocaleDateString();
          if (urlImg && urlImg != "") {
            newNote.image = urlImg;
          } else if (note.action == "DELETE") {
            delete newNote.image;
          }
          delete note.action;
        }
        return newNote;
      });
      setNotes(newNotes);
    } else {
      const newNotes = notes.map((newNote) => {
        if (newNote.noteId == note.noteId) {
          delete newNote.mode;
          delete newNote.action;
        }
        return newNote;
      });
      setNotes(newNotes);
    }
  };

  return (
    <div className={`${darkMode && "dark-mode"}`}>
      <div className="container">
        <Header handleToggleDarkMode={setDarkMode} signOut={signOut} />
        <Search handleSearchNote={setSearchText} />
        {!loading ? (
          <NotesList
            notes={notes}
            notesFiltered={notes.filter((note) =>
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
