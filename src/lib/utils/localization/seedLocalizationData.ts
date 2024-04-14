import { FirestoreCollections } from "../../constants/firestoreCollectionNames";
import { languageData } from "../../constants/languageData";
import { firestore } from "../../firebase/config";
import { Language, Resource } from "../../models";
import createFirestoreDataManager from "../firestore/createFirestoreDataManager";

const dataManager = createFirestoreDataManager(firestore);

export async function seedLocalizationData() {
  for (const [language, data] of Object.entries(languageData)) {
    const collectionPath = {
      rootPath: FirestoreCollections.Languages,
      segments: [language],
    };
    const pageRequest = {
      pageSize: 0, 
    };

    const response = await dataManager.list<Language>(
      { rootPath: collectionPath.rootPath },
      pageRequest
    );

    const exists = response.items.some(x=> x.code === language);

    if (!exists) {
      console.log(`Seeding data for language: ${language}`);
      await dataManager.set<Language>(
        collectionPath,
        {
          ...data,
        },
      );

      for (const [key, value] of Object.entries(data.resources)) {
        await dataManager.set<Resource>(
          {
            rootPath: FirestoreCollections.Languages,
            segments: [language, FirestoreCollections.Resources, key],
          },
          { value },
          undefined,
          false
        );
      }
    }
  }
}
