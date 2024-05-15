import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../Services/account.service';
import { DataServiceService } from '../../../Services/data-service.service';
import { ILoginResponse } from '../../../Models/UserInterfaces/ILoginResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginData = new FormGroup({
    email: new FormControl("",[Validators.required,Validators.email]),
    password: new FormControl("",[Validators.required,Validators.minLength(8)]),
    rememberMe: new FormControl(false),
  })
  LoginSub:any;
  NotFound:boolean = false;
  Category: any = {};
  constructor(
    public accService:AccountService,
    public DataService:DataServiceService,
    public router:Router,
    public activeRoute:ActivatedRoute) {
    
  }
  ngOnInit(): void {
  }
  get getEmail() {
    return this.LoginData.controls['email'];
  }
  get getPassword() {
    return this.LoginData.controls['password'];
  }
  get getRememberMe() {
    return this.LoginData.controls['rememberMe'];
  }
  submit() {
    if(this.LoginData.status == "VALID"){
      this.LoginSub = this.accService.login(this.LoginData.value).subscribe({
        next:(data:ILoginResponse)=>{
          this.DataService.SetData(data.user,data.token,data.role,data.cartCount,data.wishCount)
          if(data.role == "Admin"){
            this.router.navigate(['/productDash']);
          }
          else{
            this.router.navigate(['/products']);
          }
        },
        error:(err)=>{
          this.NotFound = true;
          console.log(err);
        }
      })
    }
    
  }
  ngOnDestroy(): void {
    if(this.LoginSub) this.LoginSub.unsubscribe();
  }
}
