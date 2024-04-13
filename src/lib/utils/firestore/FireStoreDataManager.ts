import { Transaction } from "firebase/firestore";
import DataManager from "../../database/DataManager";
import DefaultDataReference from "../../database/DefaultDataReference";
import CollectionPath from "../../database/types/CollectionPath";
import DocumentPath from "../../database/types/DocumentPath";
import TransactionOperation from "./TransactionOperation";

interface FireStoreDataManager extends DataManager {
  add<T extends DefaultDataReference>(
    collectionPath: CollectionPath,
    data: T,
    transaction?: Transaction
  ): Promise<T>;

  set<T extends DefaultDataReference>(
    documentPath: DocumentPath,
    data: T,
    transaction?: Transaction
  ): Promise<void>;

  update<T extends DefaultDataReference>(
    documentPath: DocumentPath,
    data: Partial<T>,
    transaction?: Transaction
  ): Promise<void>;

  remove(documentPath: DocumentPath, transaction?: Transaction): Promise<void>;

  /**
   * Firestore'da transaction kullanarak veritabanı işlemlerini yürütür.
   * @param operation - Transaction içinde gerçekleştirilecek işlem(ler) fonksiyonu
   * @example
   * const collectionPath1: CollectionPath = {
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
   * @returns İşlem sonucunu döner
   */
  transaction<T>(operation: TransactionOperation<T>): Promise<T>;
}

export default FireStoreDataManager;
