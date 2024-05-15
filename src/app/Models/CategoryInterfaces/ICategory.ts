// export interface ApiResponse {
//     $id: string;
//     categories: Category[];
//     totalPages: number;
//   }
  
  export interface Category {
    $id: string;
    id: number;
    title: string;
    productsCount: number;
  }
  
  export interface IFilterCategory {
    id: number;
    title: string;
    productsCount: number;
    selected: boolean;
  }