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

function App({ signOut }) {

  async function addNote (){
    const data ={
      body: {
        noteId : "1",
        user : "Dilanka",
        description : "My first note",
        imageURL : ""
      }
    }

  const apiData = await API.post('notesapi', '/notes', data)
  console.log("dheiude", apiData)
  alert('User added')
  }
  return (
    <View className="App">
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
      <Button onClick={addNote}>Add Note</Button>
    </View>
  );
}

export default withAuthenticator(App);