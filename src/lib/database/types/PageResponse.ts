/**
 * Sayfalama işlemi sonucunda dönen veri yapısını belirtir
  * @param items - Sayfa içerisindeki verileri belirtir
  * @param totalCount - Toplam veri sayısını belirtir
  * @param pageSize - Sayfa başına kaç veri çekileceğini belirtir
  * @param currentPage - Hangi sayfanın çekildiğini belirtir
  * @param totalPages - Toplam kaç sayfa olduğunu belirtir
 */
type PageResponse<T> = {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export default PageResponse;
