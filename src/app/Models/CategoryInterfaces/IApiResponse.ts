import { Category } from "./ICategory";

export interface ICategoryResponse {
    $id: string;
    categories: {
      $id:number
      $values: Category[]
    };
    totalPages: number;
  }