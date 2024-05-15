import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap, throwError } from 'rxjs';
import { IProductResponse } from '../Models/ProductInterfaces/IProductResponse';
import { IProductImage } from '../Models/ProductInterfaces/IProductImage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl: string = 'http://localhost:37667/api/Products';
  cloudinaryUrl: string = 'https://api.cloudinary.com/v1_1/drv84xocp/image/upload';
  constructor(private http: HttpClient) { }
  getProducts(page: number = 1, pageSize: number = 9):Observable<IProductResponse>{
    return this.http.get<IProductResponse>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  filterProducts(selectedCategories: string[], page: number = 1, pageSize: number = 9): Observable<any> {
    let queryParams = new HttpParams();
    selectedCategories.forEach(category => {
      queryParams = queryParams.append('categories', category);
    });
    queryParams = queryParams.append('page', page.toString())
                             .append('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/filter`, { params: queryParams });
  }
  
  getProduct(id: number){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: any){
    return this.http.put(`${this.apiUrl}/data/${id}`, product);
  }
  updateProductWithImage(id: number, product: IProductImage, imageFile: File){
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'l2d1twsh');
    return this.http.post<any>(this.cloudinaryUrl, formData)
      .pipe(
        mergeMap((uploadResponse: any) => {
          if (uploadResponse && uploadResponse.secure_url) {
            product.img = uploadResponse.secure_url;
            return this.updateProductImage(id, product);
          } else {
            return throwError('Image upload to Cloudinary failed');
          }
        })
      );
  }
  updateProductImage(id: number, image: any){
    return this.http.put(`${this.apiUrl}/data/img/${id}`, image);
  }
  addProductWithImage(product: any, imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'l2d1twsh'); 
    
    return this.http.post<any>(this.cloudinaryUrl, formData)
      .pipe(
        mergeMap((uploadResponse: any) => {
          if (uploadResponse && uploadResponse.secure_url) {
            product.img = uploadResponse.secure_url;
            return this.addProduct(product);
          } else {
            return throwError('Image upload to Cloudinary failed');
          }
        })
      );
  }

  addProduct(product: any){
    return this.http.post(`${this.apiUrl}`, product);
  }

  deleteProduct(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
