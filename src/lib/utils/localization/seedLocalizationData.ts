import { FirestoreCollections } from "../../constants/firestoreCollectionNames";
import { languageData } from "../../constants/languageData";
import { firestore } from "../../firebase/config";
import { Language, Resource } from "../../models";
import createFirestoreDataManager from "../firestore/createFirestoreDataManager";

const dataManager = createFirestoreDataManager(firestore);

export async function seedLocalizationData() {
  const currentTime = Date.now();

  for (const [language, data] of Object.entries(languageData)) {
    // Kontrol etmek için list metodu kullanılıyor
    const collectionPath = {
      rootPath: FirestoreCollections.Languages,
      segments: [language],
    };
    const pageRequest = {
      pageSize: 1, // Sadece doküman varlığını kontrol etmek için 1 yeterli
    };

    const response = await dataManager.list(
      { rootPath: collectionPath.rootPath },
      pageRequest
    );
    const exists = response.totalCount > 0;

    if (!exists) {
      console.log(`Seeding data for language: ${language}`);
      // Dil verilerini eklemek için set metodu kullanılıyor
      await dataManager.set<Language>(collectionPath, {
        ...data
      });

      // Her bir dil için kaynakları ekleyin
      for (const [key, value] of Object.entries(data.resources)) {
        await dataManager.set<Resource>(
          {
            rootPath: FirestoreCollections.Languages,
            segments: [language, FirestoreCollections.Resources, key],
          },
          { value }
        );
      }
    }
  }
}
