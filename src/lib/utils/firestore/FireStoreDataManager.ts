import { Transaction } from "firebase/firestore";
import DataManager from "../../database/DataManager";
import DefaultDataReference from "../../database/DefaultDataReference";
import CollectionPath from "../../database/types/CollectionPath";
import DocumentPath from "../../database/types/DocumentPath";
import TransactionOperation from "./TransactionOperation";

interface FireStoreDataManager extends DataManager {
  /**
   *  Firestore verilerini belirli bir yol altında kendi oluşturduğu id değeri ile ekle
   * @param collectionPath - kök dizin ve diğer segmentlerin belirtildiği yol
   * @param data - Veri modeli
   * @param transaction  - Firestore transaction nesnesi
   * @param includeDefaultFields  - Varsayılan alanların eklenip eklenmeyeceğini belirler
   * @example 
      const collectionPath : CollectionPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages"]
      } 

      const data: User = {
        first: "Toji",
        last: "Mato",
        born: 1990,
        additional: {
          email: "tojimato@gmail.com",
          phone: "1234567890",
        },
      };

      const addedDoc = await db.add<User>(collectionPath, data);
   * @remarks Yazılan rootpath ve segmentlerin toplamı tek sayı olmalıdır. Yoksa hata alınacaktır. 
   * @returns Kaydedilen veriyi id degiskeni ile döner
   * */
  add<T extends DefaultDataReference>(
    collectionPath: CollectionPath,
    data: T,
    transaction?: Transaction,
    includeDefaultFields?: boolean
  ): Promise<T>;
  /**
   * Firestore verilerini belirli bir yol altında ayarlar
   * @remarks
   * Bu methodu kullanirken belirtilen dizindeki verilerin tamami yeni gonderilen ile degisir. Kullanimina dikkat ediniz.
   *
   * @param documentPath - Setlenecek dökümanın yolunu ifade eder.
   * @param data - Veri modeli
   * @param transaction  - Firestore transaction nesnesi
   * @param includeDefaultFields  - Varsayılan alanların eklenip eklenmeyeceğini belirler
   * @example
   * const collectionPath: CollectionPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      const data: Message = {
        message: "Test message changed with set operation.",
      };

      await db.set<Message>(collectionPath, data);
   * */
  set<T extends DefaultDataReference>(
    documentPath: DocumentPath,
    data: T,
    transaction?: Transaction,
    includeDefaultFields?: boolean
  ): Promise<void>;

  /**
   * Firestore verilerini belirli bir yol altında günceller
   * @param documentPath - deleted oiarak işaretlenecek dökümanın yolunu ifade eder.
   * @param data - Veri modeli
   * @param transaction  - Firestore transaction nesnesi
   * @param includeDefaultFields  - Varsayılan alanların eklenip eklenmeyeceğini belirler
   * @example
   *  const documentPath: DocumentPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      await db.update<Message>(documentPath, {
        message: "Test message changed with update operation.",
      });
   * */
  update<T extends DefaultDataReference>(
    documentPath: DocumentPath,
    data: Partial<T>,
    transaction?: Transaction,
    includeDefaultFields?: boolean
  ): Promise<void>;

  /**
   * Firestore verilerini belirli bir yol altında kaldırır. Burada kaldırma işlemi mantıksal silme olarak yapılacaktır.
   * Her veriye bir deleted alanı ekleyerek bu alanı true yaparak silme işlemi gerçekleştirilecektir.
   * @param documentPath - deleted oiarak işaretlenecek dökümanın yolunu ifade eder.
   * @param transaction  - Firestore transaction nesnesi
   * @example
   * const documentPath: DocumentPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      await db.remove(documentPath);
   * */
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
