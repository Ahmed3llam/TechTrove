import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ICategoryResponse } from '../Models/CategoryInterfaces/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl: string = 'http://localhost:37667/api/Categories';
  
  constructor(private http: HttpClient) { }
  
  getCategories(page: number = 1, pageSize: number = 9): Observable<ICategoryResponse> {
    return this.http.get<ICategoryResponse>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
