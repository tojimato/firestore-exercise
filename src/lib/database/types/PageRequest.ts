import { FilterCriteria } from "./FilterCriteria";
/**
 * Liste çekerken kullanılacak olan filtreleme ve sıralama bilgilerini içeren nesne
 * @param pageSize - Sayfa başına kaç veri çekileceğini belirtir
 * @param pageNumber - Hangi sayfanın çekileceğini belirtir
 * @param sortBy - Hangi alana göre sıralama yapılacağını belirtir
 * @param sortOrder - Sıralama tipini belirtir
 * @param filters - Filtreleme yapılacak alanları ve değerleri belirtir
 * @param startAt - Sayfalama yapılırken belirli bir noktadan başlamak için kullanılır
 * @param startAfter - Sayfalama yapılırken belirli bir noktadan sonra başlamak için kullanılır.
 *  Bu değer `SortBy` alanına göre belirlenmelidir
 */
type PageRequest = {
  pageSize: number;
  pageNumber?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: FilterCriteria[];
  startAt?: any; 
  startAfter?: any; 
};

export default PageRequest;
