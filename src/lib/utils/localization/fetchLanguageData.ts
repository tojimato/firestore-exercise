import { FirestoreCollections } from "../../constants/firestoreCollectionNames";
import { analytics, firestore } from "../../firebase/config";
import { LocalizedStrings } from "./types/LocalizedStrings";
import createFirestoreDataManager from "../firestore/createFirestoreDataManager";
import CollectionPath from "../../database/types/CollectionPath";
import { Resource } from "../../models";
import { logEvent } from "firebase/analytics";

export async function fetchLanguageData(
  language: string
): Promise<LocalizedStrings> {
  const db = createFirestoreDataManager(firestore);
  const localizedTexts: LocalizedStrings = {};
  try {
    const ref: CollectionPath = {
      rootPath: FirestoreCollections.Languages,
      segments: [language, FirestoreCollections.Resources],
    };

    const pageRequest = {
      pageSize: 0,
    };

    const languageResources = await db.list<Resource>(ref, pageRequest);

    languageResources.items.forEach((doc) => {
      localizedTexts[doc.id] = doc.value as string;
    });

    console.log("Fetched language data: ", localizedTexts)
    return localizedTexts;
  } catch (e) {
    if (e instanceof Error) {
      logEvent(analytics, "exception", {
        description: e.message,
        fatal: true,
      });
    }
    throw new Error(
      `Error fetching language data: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
  }
}
