import { FilterCriteria } from "./FilterCriteria";

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
