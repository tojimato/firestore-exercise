import {
  DocumentData,
  Firestore,
  QueryConstraint,
  Transaction,
  WithFieldValue,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";
import { analytics } from "../../firebase/config";
import { logEvent } from "firebase/analytics";
import DefaultDataReference from "../../database/DefaultDataReference";
import CollectionPath from "../../database/types/CollectionPath";
import DocumentPath from "../../database/types/DocumentPath";
import PageRequest from "../../database/types/PageRequest";
import PageResponse from "../../database/types/PageResponse";
import FireStoreDataManager from "./FireStoreDataManager";
import TransactionOperation from "./TransactionOperation";

/**
 *  Firestore instance'ı alarak bir DataManager oluşturun
 *
 * */
function createFirestoreDataManager(
  firestore: Firestore
): FireStoreDataManager {
  return {
    list: async function <T>(
      collectionPath: CollectionPath,
      pageRequest: PageRequest
    ): Promise<PageResponse<T>> {
      let constraints: QueryConstraint[] = [where("deleted", "!=", true)];

      if (pageRequest.sortBy) {
        constraints.push(
          orderBy(pageRequest.sortBy, pageRequest.sortOrder || "asc")
        );
      }

      if (pageRequest.filters) {
        pageRequest.filters.forEach((filter) => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      if (pageRequest.pageSize && pageRequest.pageSize > 0) {
        constraints.push(limit(pageRequest.pageSize));
        if (pageRequest.startAfter) {
          constraints.push(startAfter(pageRequest.startAfter));
        } else if (pageRequest.startAt) {
          constraints.push(startAt(pageRequest.startAt));
        }
      }

      const q = query(
        collection(
          firestore,
          collectionPath.rootPath,
          ...(collectionPath.segments ?? [])
        ),
        ...constraints
      );

      const querySnapshot = await getDocs(q);

      const items: T[] = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as T & { id: string };
      });

      const countDoc = await getDoc(
        doc(firestore, "aggregates", collectionPath.rootPath)
      );

      const totalCount = countDoc.exists() ? countDoc.data().count : 0;
      const totalPages = Math.ceil(totalCount / pageRequest.pageSize);

      return {
        items,
        totalCount,
        pageSize: pageRequest.pageSize,
        currentPage: pageRequest.pageNumber ?? 1,
        totalPages,
      };
    },
    get: async function <T>(
      collectionPath: CollectionPath,
      documentPath: DocumentPath
    ): Promise<T | undefined> {
      try {
        const collectionRef = collection(
          firestore,
          collectionPath.rootPath,
          ...(collectionPath.segments ?? [])
        );

        const docRef = doc(
          collectionRef,
          documentPath.rootPath,
          ...(documentPath.segments ?? [])
        );

        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
          console.log("Document does not exist.");
          return undefined;
        }

        const data = docSnapshot.data() as DocumentData;

        if (data.deleted) {
          console.log("Document is marked as deleted.");
          return undefined;
        }

        return { id: docSnapshot.id, ...data } as T & { id: string };
      } catch (e) {
        console.error("Error getting document: ", e);
        if (e instanceof Error) {
          logEvent(analytics, "exception", {
            description: e.message,
            fatal: true,
          });
        }
        throw e;
      }
    },
    add: async function <T extends DefaultDataReference>(
      collectionPath: CollectionPath,
      data: T,
      transaction?: Transaction,
      includeDefaultFields: boolean = true
    ): Promise<T> {
      try {
        const dataWithInfos = data as WithFieldValue<DocumentData>;

        if (includeDefaultFields) {
          dataWithInfos.createdAt = new Date().getTime();
          dataWithInfos.createdBy = "system";
        }

        if(!("deleted" in data)){
          dataWithInfos.deleted = false;
        }

        const collectionRef = collection(
          firestore,
          collectionPath.rootPath,
          ...(collectionPath.segments ?? [])
        );

        if (!transaction) {
          const response = await addDoc(collectionRef, data);
          return { ...data, id: response.id };
        } else {
          const newDocRef = doc(collectionRef);
          transaction.set(newDocRef, data);
          return { ...data, id: newDocRef.id };
        }
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
    set: async function <T extends DefaultDataReference>(
      documentPath: CollectionPath,
      data: T,
      transaction?: Transaction,
      includeDefaultFields: boolean = true
    ): Promise<void> {
      try {
        const dataWithInfos = data as WithFieldValue<DocumentData>;

        if (includeDefaultFields) {
          dataWithInfos.createdAt = new Date().getTime();
          dataWithInfos.createdBy = "system";
          dataWithInfos.updatedAt = new Date().getTime();
          dataWithInfos.updatedBy = "system";
        }

        if(!("deleted" in data)){
          dataWithInfos.deleted = false;
        }

        const ref = doc(
          firestore,
          documentPath.rootPath,
          ...(documentPath.segments ?? [])
        );

        if (transaction) {
          transaction.set(ref, dataWithInfos, { merge: true });
        } else {
          await setDoc(ref, dataWithInfos, { merge: true });
        }
      } catch (e) {
        console.error("Error setting document: ", e);
        if (e instanceof Error) {
          logEvent(analytics, "exception", {
            description: e.message,
            fatal: true,
          });
        }
        throw e;
      }
    },
    update: async function <T extends DefaultDataReference>(
      documentPath: DocumentPath,
      data: Partial<T>,
      transaction?: Transaction,
      includeDefaultFields: boolean = true
    ): Promise<void> {
      try {
        const dataWithInfos = data as WithFieldValue<DocumentData>;

        if (includeDefaultFields) {
          dataWithInfos.updatedAt = new Date().getTime();
          dataWithInfos.updatedBy = "system";
        }
        
        const ref = doc(
          firestore,
          documentPath.rootPath,
          ...(documentPath.segments ?? [])
        );

        if (transaction) {
          transaction.update(ref, dataWithInfos);
        } else {
          await updateDoc(ref, dataWithInfos);
        }
      } catch (e) {
        console.error("Error updating document: ", e);
        if (e instanceof Error) {
          logEvent(analytics, "exception", {
            description: e.message,
            fatal: true,
          });
        }
        throw e;
      }
    },
    remove: async function (
      documentPath: DocumentPath,
      transaction?: Transaction
    ): Promise<void> {
      try {
        await this.update(documentPath, { deleted: true }, transaction);
      } catch (e) {
        console.error("Error removing document: ", e);
        if (e instanceof Error) {
          logEvent(analytics, "exception", {
            description: e.message,
            fatal: true,
          });
        }
        throw e;
      }
    },
    transaction: async function <T>(
      operation: TransactionOperation<T>
    ): Promise<T> {
      try {
        return await runTransaction(firestore, operation);
      } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
      }
    },
  };
}

export default createFirestoreDataManager;
