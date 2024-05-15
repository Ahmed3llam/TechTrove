import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap, throwError } from 'rxjs';
import { IUSerFromLogin } from '../Models/UserInterfaces/ILoginResponse';
import { IPassword } from '../Models/UserInterfaces/IPassword';
import { IImg } from '../Models/UserInterfaces/IImg';
import { IUser } from '../Models/UserInterfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  apiUrl: string = 'http://localhost:37667/api/Profile';
  cloudinaryUrl: string = 'https://api.cloudinary.com/v1_1/drv84xocp/image/upload';

  constructor(private http: HttpClient) { }
  getProfile() :Observable<IUSerFromLogin>{
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.get<IUSerFromLogin>(`${this.apiUrl}`, options);
  }

  editProfile(userData: IUser): Observable<IUSerFromLogin> {
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    console.log(userData);
    return this.http.put<IUSerFromLogin>(`${this.apiUrl}/data`, userData, options);
  }

  updateUserImage(id: string, user: IImg, imageFile: File){
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'l2d1twsh');
    return this.http.post<any>(this.cloudinaryUrl, formData)
      .pipe(
        mergeMap((uploadResponse: any) => {
          if (uploadResponse && uploadResponse.secure_url) {
            user.img = uploadResponse.secure_url;
            return this.editProfileImage(user);
          } else {
            return throwError('Image upload to Cloudinary failed');
          }
        })
      );
  }

  editProfileImage(userImg: IImg) {
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.put(`${this.apiUrl}/data/image`, userImg, options);
  }

  editPassword(passwordData: IPassword) {
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.put(`${this.apiUrl}/data/password`, passwordData, options);
  }

  deleteUser(id: string) {
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.delete(`${this.apiUrl}?id=${id}`, options);
  }
}
