# NSC DEVELOPMENT GUIDE

Bu döküman proje içerisinde isimlendirme, klasörleme ve benzeri konular ile ilgili kuralları kapsamaktadır.

## Verilere Erişim (Push, Set, Update, Remove, Get, List, Transaction)

Proje kapsamında firebase firestore kullanılmaktadır. Fakat kodlama yaparken firestore'a ait kendi sdk kodları yerine  aşağıdaki yolda bulunan firestoreDataManager fonksiyonu ile oluşturmuş fonksiyon kullanılmalıdır. 

- src
    - lib
        - firestore
            - createFirestoreDataManager.ts

**Note: Eğer yapılamayacak bir durum var ise; bu özellik belirtilen fonksiyona eklenerek dahil edilmelidir.**

### `Add Örnek`

Kayıt ekleme özelliği buraya gelecek.

### `Update Örnek`

Kayıt ekleme özelliği buraya gelecek.

### `Remove Örnek`

Kayıt ekleme özelliği buraya gelecek.

### `Get Örnek`

Kayıt ekleme özelliği buraya gelecek.

### `List Örnek`

Kayıt ekleme özelliği buraya gelecek.

### `Transaction Örnek`

Kayıt ekleme özelliği buraya gelecek.

## Localization - Yazı ve Text Kullanımı

Bütün yazı text ve diğer sabitler aşağıdaki yolda bulunan fonksiyon ile birlikte key değerleri ile ekranlar içerisine yazılmalıdır.

- src
    - lib
        - localization
            - localize.ts


### `localize fonksiyon kullanımı`

Aşağıdaki şekilde ekranlar içerisinde ilgili key değerini firestoreda bulunan resource keylerine karşılık gelen değerler şeklinde kullanabilirsiniz.

**Note: Eğer ilgili text bulunmuyorsa ekranda key değeri gözükecektir. Firestore kısmına ilgili key değer ikilisi eklenmelidir.**

```typescript
// Example usage
async function example() {
  const language = "en"; // Chosen language
  const Resource = await localize(language);

  // Example usage
  console.log(Resource.TXT_ADD_BUTTON);   
  // Output will be the localized text for the key "TXT_ADD_BUTTON" if available, otherwise "TXT_ADD_BUTTON" itself
}
```


