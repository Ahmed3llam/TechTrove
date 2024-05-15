import { Injectable, OnDestroy } from '@angular/core';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
  dataSub:any;
  constructor(public dataService:DataServiceService) { }
  ngOnDestroy(): void {
    if(this.dataSub) this.dataSub.unsubscribe();
  }
  isAuthenticated(): boolean {
    let token;
    this.dataSub = this.dataService.getToken().subscribe({
      next:(data)=>{
        token = data;
      },
    })
    if(token) return true;
    else return false;
  }

  isAdmin(): boolean {
    let role;
    this.dataSub = this.dataService.getRole().subscribe({
      next:(data)=>{
        role = data;
      },
    })
    if(role == "Admin") return true;
    else return false;
  }
}
