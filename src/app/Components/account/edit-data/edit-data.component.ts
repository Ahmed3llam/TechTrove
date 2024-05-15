import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../Services/profile.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IUSerFromLogin } from '../../../Models/UserInterfaces/ILoginResponse';
import { CommonModule } from '@angular/common';
import { IPassword } from '../../../Models/UserInterfaces/IPassword';
import { IUser } from '../../../Models/UserInterfaces/IUser';
import { DataServiceService } from '../../../Services/data-service.service';
@Component({
  selector: 'app-edit-data',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
templateUrl: './edit-data.component.html',
  styleUrl: './edit-data.component.css'
})
export class EditDataComponent {
  Data: any = {};
  paramSub:any;
  dataSub:any;
  imgSub:any;
  passwordSub:any;
  UserId:string="";
  editType:any;
  User: any = {};
  selectedImage:any;
  notValid:boolean = false;
  constructor(
    public profileService:ProfileService,
    public dataService:DataServiceService,
    public router:Router,
    public activeRoute:ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.paramSub = this.activeRoute.params.subscribe({
      next:(data)=>{
        this.UserId = data['id'];
        if(data['edit'] == "ProfileImage"){
          this.editType = "Edit Profile Image";
          this.Data= new FormGroup({
            image: new FormControl("",[Validators.required])
          })
          this.getImage.setValue("");
        }else if(data['edit'] == "Password"){
          this.editType = "Edit Password";
          this.Data= new FormGroup({
            oldPassword: new FormControl("",[Validators.required,Validators.minLength(8)]),
            newPassword: new FormControl("",[Validators.required,Validators.minLength(8)]),
            confirmPassword: new FormControl("",[Validators.required,Validators.minLength(8)]),
          })
          this.getoldPassword.setValue("");
          this.getnewPassword.setValue("");
          this.getconfirmPassword.setValue("");
        }
        else{
          this.editType = "Edit Data";
          this.Data= new FormGroup({
            firstName: new FormControl("",[Validators.required,Validators.minLength(3)]),
            lastname: new FormControl("",[Validators.required,Validators.minLength(3)]),
            phoneNumber: new FormControl("",[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]),
            gender: new FormControl("",[Validators.required,Validators.minLength(4)]),
            email: new FormControl("",[Validators.required,Validators.email]),
            address: new FormControl("",[Validators.required,Validators.minLength(6)])
          })
          this.getfirstName.setValue("");
          this.getlastname.setValue("");
          this.getphoneNumber.setValue("");
          this.getgender.setValue("");
          this.getemail.setValue("");
          this.getaddress.setValue("");
        }
      }
    })
    this.profileService.getProfile().subscribe({
      next: (response: IUSerFromLogin) => {
        this.User = response;
        if(this.editType == "Edit Profile Image"){
          this.getImage.setValue("");
        }
        else if(this.editType == "Edit Password"){
          this.getoldPassword.setValue("");
          this.getnewPassword.setValue("");
          this.getconfirmPassword.setValue("");
        }
        else{
          this.getfirstName.setValue(this.User.firstName);
          this.getlastname.setValue(this.User.lastname);
          this.getphoneNumber.setValue(this.User.phoneNumber);
          this.getgender.setValue(this.User.gender);
          this.getemail.setValue(this.User.email);
          this.getaddress.setValue(this.User.address);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  onImageSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
    }
  }
  get getfirstName() {
    return this.Data.controls['firstName'];
  }
  get getlastname() {
    return this.Data.controls['lastname'];
  }
  get getphoneNumber() {
    return this.Data.controls['phoneNumber'];
  }
  get getgender() {
    return this.Data.controls['gender'];
  }
  get getemail() {
    return this.Data.controls['email'];
  }
  get getaddress() {
    return this.Data.controls['address'];
  }
  get getImage() {
    return this.Data.controls['image'];
  }
  get getoldPassword() {
    return this.Data.controls['oldPassword'];
  }
  get getnewPassword() {
    return this.Data.controls['newPassword'];
  }
  get getconfirmPassword() {
    return this.Data.controls['confirmPassword'];
  }
  submit() {
    if(this.Data.status == "VALID"){
      if(this.editType == "Edit Password"){
        if(this.getnewPassword.value != this.getconfirmPassword.value){
          this.getconfirmPassword.setValue("");
          this.notValid = true;
        }
        else if(this.getnewPassword.value == this.getconfirmPassword.value){
          this.passwordSub = this.profileService.editPassword({
            id:this.UserId,
            oldPassword:this.getoldPassword.value,
            newPassword:this.getnewPassword.value,
            confirmPassword:this.getconfirmPassword.value
          }).subscribe({
            next: (data) => {
              this.router.navigate(['/profile']);
            },
            error: (err) => {
              console.log(err);
              this.notValid = true;
            }
          });
        }
      }
      else if (this.editType =="Edit Profile Image"){
        this.passwordSub=this.profileService.updateUserImage(
          this.UserId,
          {
            id:this.UserId,
            img:this.getImage.value
          },
          this.selectedImage).subscribe({
            next: (data) => {
              this.router.navigate(['/profile']);
            },
            error: (err) => {
              this.notValid = true;
            }
          })
      }
      else{
        this.dataSub=this.profileService.editProfile({
          id:this.UserId,
          firstName:this.getfirstName.value,
          lastName:this.getlastname.value,
          profileImage:"",
          phoneNumber:this.getphoneNumber.value,
          gender:this.getgender.value,
          email:this.getemail.value,
          Address:this.getaddress.value,
        }).subscribe({
          next: (data: IUSerFromLogin) => {
            this.dataService.setUserData(data);
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.notValid = true;
          }
        })
      }
    }
    else{
      this.notValid = true;
    }
  }
  ngOnDestroy(): void {
    if(this.paramSub) this.paramSub.unsubscribe();
    if(this.dataSub) this.dataSub.unsubscribe();
    if(this.imgSub) this.imgSub.unsubscribe();
    if(this.passwordSub) this.passwordSub.unsubscribe();
  }
}
