import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import NotesList from './components/NotesList';
import Search from './components/Search';
import Header from './components/Header';

function App({ signOut }) {

  const [notes, setNotes] = useState([
		{
			id: nanoid(),
			description: 'This is my first note!',
			date: '15/04/2021',
		},
		{
			id: nanoid(),
			description: 'This is my second note!',
			date: '21/04/2021',
		},
		{
			id: nanoid(),
			description: 'This is my third note!',
			date: '28/04/2021',
		},
		{
			id: nanoid(),
			description: 'This is my new note!',
			date: '30/04/2021',
		},
	]);

	const [searchText, setSearchText] = useState('');

	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
	  const apiData = API.get('notesapi', '/notes')
    console.log("dheiude", apiData)
	}, []);

	// useEffect(() => {
	// 	localStorage.setItem(
	// 		'react-notes-app-data',
	// 		JSON.stringify(notes)
	// 	);
	// }, [notes]);

  async function addNote (){
    const date = new Date();
		const newNote = {
      body: {
        noteId : nanoid(),
        user : "Dilanka",
        description : "My first note",
        imageURL : "",
        createDate : date.toLocaleDateString()
      }
    };
    const apiData = await API.post('notesapi', '/notes', newNote)
    console.log("dheiude", apiData)
    alert('User added')
		const newNotes = [...notes, newNote.body];
		setNotes(newNotes);
  }

	const deleteNote = (id) => {
		const newNotes = notes.filter((note) => note.id !== id);
		setNotes(newNotes);
	};

	return (
		<div className={`${darkMode && 'dark-mode'}`}>
			<div className='container'>
				<Header handleToggleDarkMode={setDarkMode} signOut={signOut} />
				<Search handleSearchNote={setSearchText} />
				<NotesList
					notes={notes.filter((note) =>
						note.description.toLowerCase().includes(searchText)
					)}
					handleAddNote={addNote}
					handleDeleteNote={deleteNote}
				/>
			</div>
		</div>
	);
}

export default withAuthenticator(App);