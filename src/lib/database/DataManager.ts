import DefaultDataReference from "./DefaultDataReference";

interface DataManager {
  // Firestore verilerini belirli bir yol altında listeler
  list<T extends DefaultDataReference>(
    collectionPath: string,
    queries?: any[]
  ): Promise<T[]>;

  // Firestore verilerini belirli bir yol altında getirir
  get<T extends DefaultDataReference>(
    documentPath: string,
    queries?: any[]
  ): Promise<T | undefined>;

  /* Firestore verilerini belirli bir yol altında kendi oluşturduğu id değeri ile ekler */
  add<T extends DefaultDataReference>(
    collectionPath: string,
    data: T,
    collectionSegments?: string[]
  ): Promise<T>;

  // Firestore verilerini belirli bir yol altında ayarlar
  set<T extends DefaultDataReference>(
    documentPath: string,
    data: T,
    collectionSegments?: string[]
  ): Promise<T>;

  // Firestore verilerini belirli bir yol altında günceller
  update<T extends DefaultDataReference>(
    documentPath: string,
    data: Partial<T>,
    collectionSegments?: string[]
  ): Promise<T>;

  // Firestore verilerini belirli bir yol altında kaldırır. Burada kaldırma işlemi mantıksal silme olarak yapılacaktır.
  // Her veriye bir RecordDeleted alanı ekleyerek bu alanı true yaparak silme işlemi gerçekleştirilecektir.
  remove(documentPath: string): Promise<void>;

  // Transactional işlemleri gerçekleştirir
  transaction<T extends DefaultDataReference>(
    transactionFunc: (transaction: any) => Promise<T>
  ): Promise<T>;
}

export default DataManager;
