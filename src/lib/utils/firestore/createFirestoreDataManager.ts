import {
  DocumentData,
  Firestore,
  WithFieldValue,
  addDoc,
  collection,
} from "firebase/firestore";
import DataManager from "../../database/DataManager";
import { analytics } from "../../firebase/config";
import { logEvent } from "firebase/analytics";
import DefaultDataReference from "../../database/DefaultDataReference";

// Firestore instance'ı alarak bir DataManager oluşturun
function createFirestoreDataManager(firestore: Firestore): DataManager {
  return {
    list: async function <T>(
      collectionPath: string,
      queries: any[] = []
    ): Promise<T[]> {
      // Firestore listeleme işlemi burada gerçekleşecek
      // Örneğin: const querySnapshot = await firestore.collection(collectionPath).where(...queries).get();
      //           return querySnapshot.docs.map(doc => doc.data()) as T[];

      // if (typeof {} !== typeof T || !('RecordDeleted' in new T())) {
      //   throw new Error('T tipi bir obje olmalı ve RecordDeleted alanını içermelidir.');
      // }

      return [] as T[];
    },

    get: async function <T>(
      documentPath: string,
      queries: any[] = []
    ): Promise<T | undefined> {
      // Firestore getirme işlemi burada gerçekleşecek
      // Örneğin: const docSnapshot = await firestore.doc(documentPath).get();
      //           return docSnapshot.exists ? docSnapshot.data() as T : undefined;
      return undefined;
    },

    add: async function <T extends DefaultDataReference>(collectionPath: string, data: T): Promise<T> {
      try {

        data.createdAt = new Date().getTime();
        data.deleted = false;

        console.log(data);

        const docRef = await addDoc(
          collection(firestore, collectionPath),
          data as WithFieldValue<DocumentData>
        );

        const result: T = {
          ...data,
          id: docRef.id,
        };

        return result;
      } catch (e) {
        console.error("Error adding document: ", e);
        if (e instanceof Error) {
          logEvent(analytics, "exception", {
            description: e.message,
            fatal: true,
          });
        }

        throw e;
      }
    },

    set: async function <T>(documentPath: string, data: T): Promise<T> {
      // Firestore ayarlama işlemi burada gerçekleşecek

      return {} as T;
    },

    update: async function <T>(
      documentPath: string,
      data: Partial<T>
    ): Promise<T> {
      // Firestore güncelleme işlemi burada gerçekleşecek
      return {} as T;
    },

    remove: async function (documentPath: string): Promise<void> {
      // Firestore kaldırma işlemi burada gerçekleşecek
    },

    transaction: async function <T>(
      transactionFunc: (transaction: any) => Promise<T>
    ): Promise<T> {
      // Firestore transactional işlemler burada gerçekleşecek
      // Örneğin: const result = await firestore.runTransaction(transactionFunc);
      return {} as T;
    },
  };
}

export default createFirestoreDataManager;
