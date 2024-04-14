import "./App.css";
import { analytics, auth, firestore, performance } from "./lib/firebase/config";
import { signInAnonymously } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import createFirestoreDataManager from "./lib/utils/firestore/createFirestoreDataManager";
import CollectionPath from "./lib/database/types/CollectionPath";
import { trace } from "firebase/performance";
import DocumentPath from "./lib/database/types/DocumentPath";
import { useState } from "react";
import { generateFakeUser } from "./lib/utils/faker/generateFakeUser";
import { generateFakeMessage } from "./lib/utils/faker/generateFakeMessage";
import PageRequest from "./lib/database/types/PageRequest";
import { Message, User } from "./lib/models";
import { useLocalize } from "./lib/hooks/useLocalize";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();

  const db = createFirestoreDataManager(firestore);

  const { resources, error, isFetching } = useLocalize("tr");

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>An error has occurred: {error.message}</p>;

  const anonUser = signInAnonymously(auth).then((response) => {
    return response;
  });

  const addData = async () => {
    const t = trace(performance, "ADD_USER_DATA");
    t.start();
    try {
      const collectionPath: CollectionPath = {
        rootPath: "users",
      };

      const data: User = generateFakeUser();

      const addedDoc = await db.add<User>(collectionPath, data);

      logEvent(analytics, "user-data-added", {
        method: "anonymous",
        id: addedDoc.id,
      });

      console.info(`Document written with ID: ${addedDoc.first}`);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });

      }
    }
    t.stop();
  };

  const addDataToSubCollection = async () => {
    const t = trace(performance, "ADD_USER_MESSAGE");
    t.start();
    try {
      const collectionRoute: CollectionPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages"],
      };

      const data: Message = generateFakeMessage();

      const addedDoc = await db.add<Message>(collectionRoute, data);

      logEvent(analytics, "user-data-added", {
        method: "anonymous",
        id: addedDoc.id,
      });

      console.info(
        `Document written with ID: ${addedDoc.id} Message: ${addedDoc.message}`
      );
    } catch (e) {
      console.error("Error adding document: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });
      }
    }
    t.stop();
  };

  const setData = async () => {
    const t = trace(performance, "SET_USER_FIRST_NAME");
    t.start();
    try {
      const documentPath: DocumentPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      const data: Message = generateFakeMessage();

      await db.set<Message>(documentPath, data);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });
      }
    }
    t.stop();
  };

  const removeData = async () => {
    const t = trace(performance, "REMOVE_USER_MESSAGE");
    t.start();
    try {
      const documentPath: DocumentPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      await db.remove(documentPath);
    } catch (e) {
      console.error("Error removing document: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });
      }
    }
    t.stop();
  };

  const updateData = async () => {
    const t = trace(performance, "UPDATE_USER_MESSAGE");
    t.start();
    try {
      const documentPath: DocumentPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      const data: Message = generateFakeMessage();

      await db.update<Message>(documentPath, data);
    } catch (e) {
      console.error("Error updating document: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });
      }
    }
    t.stop();
  };

  const listUsers = async () => {
    const t = trace(performance, "LIST_USERS");
    t.start();
    try {
      const collectionPath: CollectionPath = {
        rootPath: "users",
      };

      const pageRequest: PageRequest = {
        pageSize: 5,
        //startAfter: 1713026432581,
        sortBy: "createdAt",
        sortOrder: "desc",
        // filters: [
        //   {
        //     field: "first",
        //     operator: "in",
        //     value: ["Joe", "Cornell"],
        //   },
        // ],
      };

      const data = await db.list<User>(collectionPath, pageRequest);
      console.log(data);
      setUsers(data.items);
    } catch (e) {
      console.error("Error listing users: ", e);
      if (e instanceof Error) {
        logEvent(analytics, "exception", {
          description: e.message,
          fatal: true,
        });
      }
    }
    t.stop();
  };

  const doTransaction = async () => {
    const collectionPath1: CollectionPath = {
      rootPath: "users1",
    };

    const collectionPath2: CollectionPath = {
      rootPath: "users2",
    };

    const collectionPath3: CollectionPath = {
      rootPath: "users3",
    };

    const fakeUser = generateFakeUser();

    await db.transaction(async (transaction) => {
      await db.add(collectionPath1, fakeUser, transaction);
      await db.add(collectionPath2, fakeUser, transaction);
      await db.add(collectionPath3, fakeUser, transaction);
    });
  };

  const getData = async () => {
    const collectionPath: CollectionPath = {
      rootPath: "users",
    };
    const documentPath: DocumentPath = {
      rootPath: "UK7tiIS6YCgMgNXMDTyd",
    };

    const user = await db.get<User>(collectionPath, documentPath);
    console.log(user);
    setUser(user);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={addData}>{resources.TXT_ADD_DATA_TO_ROOT}</button>
        <button onClick={addDataToSubCollection}>
          Add Data To Sub Collection
        </button>
        <button onClick={setData}>Set Data</button>
        <button onClick={removeData}>Remove</button>
        <button onClick={updateData}>Update</button>
        <hr />
        <button onClick={getData}>Get Data</button>
        <button onClick={listUsers}>List - Pagination</button>
        <hr />
        <button onClick={doTransaction}>Transaction</button>
      </header>
      <main className='user-list'>
        <h1>Users </h1>
        {users.length === 0 && <h1>There is no user, sorry.</h1>}
        <ul>
          {users.map((user) => (
            <li key={user.first}>
              {user.first} {user.last}
            </li>
          ))}
        </ul>
        <hr />
        <h3>Get Individual User</h3>
        <span>press get data button to fetch user.</span>
        <div>
          <h2>{user?.first}</h2>
          <h2>{user?.last}</h2>
          <h2>{user?.born}</h2>
          <h2>{user?.additional.email}</h2>
          <h2>{user?.additional.phone}</h2>
        </div>
      </main>
    </div>
  );
}

export default App;
