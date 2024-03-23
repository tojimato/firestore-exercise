import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./lib/firebase/firebase.config";

function App() {
  const addData = async () => {
    try {
      const docRef = await addDoc(collection(firestore, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    addData();
  }, []);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>{process.env.REACT_APP_FIREBASE_APP_ID}</p>
      </header>
    </div>
  );
}

export default App;
