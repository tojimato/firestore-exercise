import logo from "./logo.svg";
import "./App.css";
import { collection, addDoc } from "firebase/firestore";
import { analytics, auth, firestore } from "./lib/firebase/config";
import { signInAnonymously } from "firebase/auth";
import { logEvent } from "firebase/analytics";

function App() {
  const addData = async () => {
    try {
      const anonUser = await signInAnonymously(auth);

      if (anonUser.user) {
        logEvent(analytics, "web-login", {
          method: "anonymous",
        });
      }

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

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo2' />
        <p>{process.env.REACT_APP_FIREBASE_APP_ID}</p>
        <button onClick={addData}>Add User</button>
        
      </header>
    </div>
  );
}

export default App;
