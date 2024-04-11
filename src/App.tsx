import "./App.css";
import { analytics, auth, firestore } from "./lib/firebase/config";
import { signInAnonymously } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import createFirestoreDataManager from "./lib/utils/firestore/createFirestoreDataManager";
import MyDataReference from "./lib/database/DefaultDataReference";

type User = {
  first: string;
  last: string;
  born: number;
  additional: {
    email: string;
    phone: string;
  };
} & MyDataReference;


function App() {
  const db = createFirestoreDataManager(firestore);
  const addData = async () => {
    try {
      const anonUser = await signInAnonymously(auth);

      if (anonUser.user) {
        logEvent(analytics, "web-login", {
          method: "anonymous",
        });
      }

      const addedDoc = await db.add<User>("users",{
        first: "Ada",
        last: "Lovelace",
        born: 1815,
        id: "",
        additional:{
          email: "tojimato@gmail.com",
          phone: "1234567890"
        }
      });

      alert(`Document written with ID: ${addedDoc.first}`);
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
        <button onClick={addData}>Add Data To Root</button>
        <button onClick={addData}>Set Data To Root </button>
        <button onClick={addData}>List Button - Pagination</button>
        <button onClick={addData}>Get Button</button>
        <button onClick={addData}>Remove Button</button>
        <button onClick={addData}>Update Button</button>
        <button onClick={addData}>Transaction Button</button>
      </header>
    </div>
  );
}

export default App;
