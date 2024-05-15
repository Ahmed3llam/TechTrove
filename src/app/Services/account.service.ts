import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap, throwError } from 'rxjs';
import { ILoginResponse } from '../Models/UserInterfaces/ILoginResponse';
import { IUserData } from '../Models/UserInterfaces/IUserData';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiUrl: string = 'http://localhost:37667/api/Account';
  cloudinaryUrl: string = 'https://api.cloudinary.com/v1_1/drv84xocp/image/upload';

  constructor(private http: HttpClient) { }

  registerWithImage(user: IUserData, imageFile: File){
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'l2d1twsh');
    return this.http.post<any>(this.cloudinaryUrl, formData)
      .pipe(
        mergeMap((uploadResponse: any) => {
          if (uploadResponse && uploadResponse.secure_url) {
            user.profileImage = uploadResponse.secure_url;
            return this.register(user);
          } else {
            return throwError('Image upload to Cloudinary failed');
          }
        })
      );
  }

  register(user: IUserData) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  adminRegisterWithImage(user: IUserData, imageFile: File){
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'l2d1twsh');
    return this.http.post<any>(this.cloudinaryUrl, formData)
      .pipe(
        mergeMap((uploadResponse: any) => {
          if (uploadResponse && uploadResponse.secure_url) {
            user.profileImage = uploadResponse.secure_url;
            return this.registerAdmin(user);
          } else {
            return throwError('Image upload to Cloudinary failed');
          }
        })
      );
  }

  registerAdmin(user: IUserData){
    return this.http.post(`${this.apiUrl}/register/admin`, user);
  }

  login(user: any): Observable<ILoginResponse>{
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, user);
  }

  logout(){
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
