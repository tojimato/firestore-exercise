import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  onDocumentUpdated,
  onDocumentCreated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";

import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
  maxInstances: 1,
  region: "europe-west1",
  timeoutSeconds: 60,
  memory: "128MiB",
});

initializeApp();

const db = getFirestore();
// Belge oluşturma durumunda sayacı artıran genel fonksiyon
export const incrementCountOnCreate = (collectionName: string) =>
  onDocumentCreated(
    {
      document: `${collectionName}/{docId}`,
      retry: true,
    },
    async (event) => {
      const newDoc = event.data?.data();
      if (newDoc && newDoc.deleted === false) {
        const countsDocRef = db.doc(`aggregates/${collectionName}`);
        return db.runTransaction(async (transaction) => {
          const countsDoc = await transaction.get(countsDocRef);
          const currentCount = countsDoc.exists
            ? countsDoc.data()?.count ?? 0
            : 0;
          transaction.set(
            countsDocRef,
            { count: currentCount + 1 },
            { merge: true }
          );
        });
      }
      return null;
    }
  );

// Belge güncelleme durumunda sayacı azaltan veya artıran genel fonksiyon
export const decrementOrIncrementCountOnUpdate = (collectionName: string) =>
  onDocumentUpdated(
    {
      document: `${collectionName}/{docId}`,
      retry: true,
    },
    async (event) => {
      const before = event.data?.before.data();
      const after = event.data?.after.data();
      if (!before || !after) {
        return null;
      }

      const countsDocRef = db.doc(`aggregates/${collectionName}`);
      return db.runTransaction(async (transaction) => {
        const countsDoc = await transaction.get(countsDocRef);
        const currentCount = countsDoc.exists ? countsDoc.data()?.count : 0;

        if (before.deleted === false && after.deleted === true) {
          transaction.set(
            countsDocRef,
            { count: Math.max(0, currentCount - 1) },
            { merge: true }
          );
        } else if (before.deleted === true && after.deleted === false) {
          transaction.set(
            countsDocRef,
            { count: currentCount + 1 },
            { merge: true }
          );
        }
      });
    }
  );

// Fiziksel silme durumunda sayacı azaltan genel fonksiyon
export const decrementCountOnPhysicalDelete = (collectionName: string) =>
  onDocumentDeleted(
    {
      document: `${collectionName}/{docId}`,
      retry: true,
    },
    async (event) => {
    
    const deletedDoc = event.data?.data();
      if (deletedDoc && deletedDoc.deleted === false) {
        const countsDocRef = db.doc(`aggregates/${collectionName}`);
        return db.runTransaction(async (transaction) => {
          const countsDoc = await transaction.get(countsDocRef);
          const currentCount = countsDoc.exists ? countsDoc.data()?.count : 0;
          transaction.set(
            countsDocRef,
            { count: Math.max(0, currentCount - 1) },
            { merge: true }
          );
        });
      }
      return null;
    }
  );


