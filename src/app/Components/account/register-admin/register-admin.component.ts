import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../Services/account.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {
  RegisterData = new FormGroup({
    fname: new FormControl("",[Validators.required,Validators.minLength(3)]),
    lname: new FormControl("",[Validators.required,Validators.minLength(3)]),
    phone: new FormControl("",[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]),
    address: new FormControl("",[Validators.required,Validators.minLength(3)]),
    email: new FormControl("",[Validators.required,Validators.email]),
    image: new FormControl("",[Validators.required]),
    gender: new FormControl("",[Validators.required,Validators.minLength(4)]),
    password: new FormControl("",[Validators.required,Validators.minLength(8)]),
    confirmPassword: new FormControl("",[Validators.required,Validators.minLength(8)]),
  })
  Sub:any;
  Category: any = {};
  selectedImage:any;
  notValid:boolean = false;
  constructor(
    public accService:AccountService,
    public router:Router,
    public activeRoute:ActivatedRoute) {
    
  }
  ngOnInit(): void {
  }
  onImageSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
    }
  }
  get getFname() {
    return this.RegisterData.controls['fname'];
  }
  get getLname() {
    return this.RegisterData.controls['lname'];
  }
  get getPhone() {
    return this.RegisterData.controls['phone'];
  }
  get getAddress() {
    return this.RegisterData.controls['address'];
  }
  get getEmail() {
    return this.RegisterData.controls['email'];
  }
  get getPassword() {
    return this.RegisterData.controls['password'];
  }
  get getConfirmPassword() {
    return this.RegisterData.controls['confirmPassword'];
  }
  get getImage() {
    return this.RegisterData.controls['image'];
  }
  get getgender() {
    return this.RegisterData.controls['gender'];
  }
  submit() {
    if(this.RegisterData.status == "VALID"){
      this.Sub = this.accService.adminRegisterWithImage({
        firstName:this.getFname.value??"",
        lastName:this.getLname.value??"",
        Address:this.getAddress.value??"",
        phoneNumber:this.getPhone.value??"",
        email:this.getEmail.value??"",
        password:this.getPassword.value??"",
        gender:this.getgender.value??"",
        profileImage:"",
        ConfirmPassword:this.getConfirmPassword.value??""
      },this.selectedImage).subscribe({
        next:(data)=>{
          console.log(data);
          this.router.navigate(['/login']);
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
    
  }
}
