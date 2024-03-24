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

      throw new Error("Error occured when insert user.");

      const docRef = await addDoc(collection(firestore, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      alert(`Document written with ID: ${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });
      }
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
