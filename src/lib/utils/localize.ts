import { FirestoreCollections } from '../constants/firestoreCollectionNames';
import { firestore } from '../firebase/config';
import { getDocs, collection } from "firebase/firestore";


async function localize(language: string): Promise<Record<string, string>> {
  const localizedTexts: Record<string, string> = {};

  try { 
    // Fetch language keys and values from Firestore
    const ref = collection(firestore, FirestoreCollections.Resources, language);
    const languageData = await getDocs(ref);

    if (languageData) {
      // If language data is available, populate the localizedTexts object
      Object.entries(languageData).forEach(([key, value]) => {
        localizedTexts[key] = value;
      });
    } else {
      console.error(`Language ${language} not found.`);
    }
  } catch (error) {
    console.error("Error fetching language data:", error);
  }

  // Return a Proxy object to handle dynamic property access
  return new Proxy(localizedTexts, {
    get: function(target, property) {
      if (!(property in target)) {
        // If the property does not exist in localizedTexts, return the property name itself
        return String(property);
      }
      return target[String(property)];
    }
  });
}

// Example usage
async function example() {
  const language = "en"; // Chosen language
  const Resource = await localize(language);

  // Example usage
  console.log(Resource.TXT_ADD_BUTTON);   
  // Output will be the localized text for the key "TXT_ADD_BUTTON" if available, otherwise "TXT_ADD_BUTTON" itself
}

export { localize, example}

