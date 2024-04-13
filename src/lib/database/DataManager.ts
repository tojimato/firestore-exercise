import CollectionPath from "./types/CollectionPath";
import DefaultDataReference from "./DefaultDataReference";
import DocumentPath from "./types/DocumentPath";
import PageRequest from "./types/PageRequest";
import PageResponse from "./types/PageResponse";

interface DataManager {
  /**
   * Firestore verilerini belirli bir yol altında listeler
   * @param collectionPath - Koleksiyonun yolunu ifade eder
   * @param pageRequest - Pagination,filtreler ve sıralama bilgilerini içerir
   * 
   * @example
   * const collectionPath: CollectionPath = {
        rootPath: "users",
     };

     const pageRequest: PageRequest = {
       pageSize: 8,
       //startAfter: 1713026432581,
       sortBy: "createdAt",
       sortOrder: "desc",
       filters: [
         {
           field: "first",
           operator: "in",
           value: ["Glenda","Allie"],
         },
       ],
     }; 
     const data = await db.list<User>(collectionPath, pageRequest);
   * @returns Çekilen verileri PageResponse tipinde döner
   * */
  list<T extends DefaultDataReference>(
    collectionPath: CollectionPath,
    pageRequest: PageRequest
  ): Promise<PageResponse<T>>;

  /**
   * Firestore verilerini belirli bir yol altında getirir
   * @param collectionPath - Koleksiyonun yolunu ifade eder
   * @param documentPath - Dökümanın yolunu ifade eder
   * @example
   * const collectionPath: CollectionPath = {
      rootPath: "users",
     };
     const documentPath: DocumentPath = {
      rootPath: "JTOQBYDDrTIyUQ4QuM4v",
     };

     const user = await db.get<User>(collectionPath, documentPath);
   * @returns Dökümanın verisini döner
   * */
  get<T extends DefaultDataReference>(
    collectionPath: CollectionPath,
    documentPath: DocumentPath
  ): Promise<T | undefined>;

  /**
   *  Firestore verilerini belirli bir yol altında kendi oluşturduğu id değeri ile ekle
   * @param collectionPath - kök dizin ve diğer segmentlerin belirtildiği yol
   * @param data - Veri modeli
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
    data: T
  ): Promise<T>;

  /**
   * Firestore verilerini belirli bir yol altında ayarlar
   * @remarks
   * Bu methodu kullanirken belirtilen dizindeki verilerin tamami yeni gonderilen ile degisir. Kullanimina dikkat ediniz.
   *
   * @param documentPath - Setlenecek dökümanın yolunu ifade eder.
   * @param data - Veri modeli
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
    data: T
  ): Promise<void>;

  /**
   * Firestore verilerini belirli bir yol altında günceller
   * @param documentPath - deleted oiarak işaretlenecek dökümanın yolunu ifade eder.
   * @param data - Veri modeli
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
    data: Partial<T>
  ): Promise<void>;

  /**
   * Firestore verilerini belirli bir yol altında kaldırır. Burada kaldırma işlemi mantıksal silme olarak yapılacaktır.
   * Her veriye bir deleted alanı ekleyerek bu alanı true yaparak silme işlemi gerçekleştirilecektir.
   * @param documentPath - deleted oiarak işaretlenecek dökümanın yolunu ifade eder.
   * @example
   * const documentPath: DocumentPath = {
        rootPath: "users",
        segments: ["dRe0jFWy1mY3r71pwTj1", "messages", "kNvOoJrXZINbz8zEsSvJ"],
      };

      await db.remove(documentPath);
   * */
  remove(documentPath: DocumentPath): Promise<void>;

}

export default DataManager;