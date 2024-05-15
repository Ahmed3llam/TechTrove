import { IProduct } from "./IProduct";

export interface IProductResponse {
    $id: string;
    products: {
      $id:number
      $values: IProduct[]
    };
    totalPages: number;
  }