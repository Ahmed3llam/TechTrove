import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../Services/product.service';
import { CategoryService } from '../../../Services/category.service';
import { ICategoryResponse } from '../../../Models/CategoryInterfaces/IApiResponse';
import { Category } from '../../../Models/CategoryInterfaces/ICategory';
import { IProductImage } from '../../../Models/ProductInterfaces/IProductImage';
import { DataServiceService } from '../../../Services/data-service.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  ProductData:any;
  paramSub:any;
  productSub:any;
  addSub:any;
  editSub:any;
  ProductId:number = 0;
  EditImage:any;
  Product: any = {};
  categories:Category[] = []
  selectedImage:any;
  userDataInfo:any;
  userId:any;
  ProductImageData:IProductImage={id:0,img:""};
  userSub:any;
  notValid:boolean = false;
  constructor(
    public prodServ:ProductService,
    public cateServ:CategoryService,
    public dataServ:DataServiceService,
    public router:Router,
    public activeRoute:ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.userSub = this.dataServ.getUserData().subscribe({
      next:(data)=>{
        this.userDataInfo = data;
        this.userId = this.userDataInfo.id;
      },
      error:(err)=>{
        console.log(err);
      }
    })
    this.paramSub = this.activeRoute.params.subscribe({
      next:(data)=>{
        this.ProductId = data['id'];
        this.EditImage = data['image'];
        if(this.ProductId != 0 && this.EditImage){
          this.ProductData = new FormGroup({
            image: new FormControl("",[Validators.required])
          })
          this.getImage.setValue("");
        }else if(this.ProductId != 0 && !this.EditImage){
          this.ProductData = new FormGroup({
            title: new FormControl("",[Validators.required,Validators.minLength(3)]),
            description: new FormControl("",[Validators.required,Validators.minLength(10)]),
            price: new FormControl(null,[Validators.required,Validators.min(1)]),
            stock: new FormControl(null,[Validators.required,Validators.min(1)]),
            categoryId: new FormControl(null,[Validators.required,Validators.min(1)]),
          })
          this.getTitle.setValue("");
          this.getDescription.setValue("");
          this.getPrice.setValue(null);
          this.getStock.setValue(null);
          this.getCategoryId.setValue(null);
        }else if(this.ProductId ==0){
          this.ProductData = new FormGroup({
            title: new FormControl("",[Validators.required,Validators.minLength(3)]),
            description: new FormControl("",[Validators.required,Validators.minLength(10)]),
            price: new FormControl(null,[Validators.required,Validators.min(1)]),
            stock: new FormControl(null,[Validators.required,Validators.min(1)]),
            image: new FormControl("",[Validators.required]),
            categoryId: new FormControl(null,[Validators.required,Validators.min(1)]),
          })
          this.getTitle.setValue("");
          this.getDescription.setValue("");
          this.getPrice.setValue(null);
          this.getStock.setValue(null);
          this.getImage.setValue("");
          this.getCategoryId.setValue(null);
        }
      }
    })
    this.cateServ.getCategories().subscribe({
      next: (response: ICategoryResponse) => {
        this.categories = response.categories.$values;
      },
      error: (err) => {
        console.log(err);
      }
    })
    if(this.ProductId != 0){
      this.productSub = this.prodServ.getProduct(this.ProductId).subscribe({
        next:(data)=>{
          this.Product = data;
          if(this.EditImage){
            this.getImage.setValue("");
          }else{
            this.getTitle.setValue(this.Product.title);
            this.getDescription.setValue(this.Product.description);
            this.getPrice.setValue(this.Product.price);
            this.getStock.setValue(this.Product.stock);
            this.getImage.setValue(this.Product.image);
            this.getCategoryId.setValue(this.Product.categoryId);
          }
        }
      });
    }
  }
  onImageSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
    }
  }
  get getTitle() {
    return this.ProductData.controls['title'];
  }
  get getDescription() {
    return this.ProductData.controls['description'];
  }
  get getPrice() {
    return this.ProductData.controls['price'];
  }
  get getStock() {
    return this.ProductData.controls['stock'];
  }
  get getImage() {
    return this.ProductData.controls['image'];
  }
  get getCategoryId() {
    return this.ProductData.controls['categoryId'];
  }
  submit() {
    if(this.ProductData.status == "VALID"){
      if(this.ProductId == 0){
        const userId = this.userId;
        const productDataWithUserId = { ...this.ProductData.value, userId };
        console.log(productDataWithUserId);
        this.addSub = this.prodServ.addProductWithImage(productDataWithUserId, this.selectedImage).subscribe({
          next:(data)=>{
            this.router.navigate(['/productDash']);
          },
          error:(err)=>{
            console.log(err);
          }
        });
      }
      else if(this.EditImage && this.ProductId != 0 && this.selectedImage){
        this.ProductImageData = { id:this.ProductId, img: this.selectedImage.name };
        this.editSub = this.prodServ.updateProductWithImage(this.ProductId,this.ProductImageData, this.selectedImage).subscribe({
          next:(data)=>{
            this.router.navigate(['/productDash']);
          }
        });
      }
      else if(this.ProductId != 0 && !this.selectedImage){
        this.Product={
          id:this.ProductId,
          title:this.getTitle.value,
          description:this.getDescription.value,
          price:this.getPrice.value,
          stock:this.getStock.value,
          categoryId:this.getCategoryId.value
        }
        this.editSub = this.prodServ.updateProduct(this.ProductId,this.Product).subscribe({
          next:(data)=>{
            console.log(data);
            this.router.navigate(['/productDash']);
          }
        });
      }
    }else{
      this.notValid = true;
    }
  }
  ngOnDestroy(): void {
    if(this.paramSub) this.paramSub.unsubscribe();
    if(this.productSub) this.productSub.unsubscribe();
    if(this.addSub) this.addSub.unsubscribe();
    if(this.editSub) this.editSub.unsubscribe();
    if(this.userSub) this.userSub.unsubscribe();
  }
}
