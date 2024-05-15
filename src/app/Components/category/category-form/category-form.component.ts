import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../Services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {
  CategoryData = new FormGroup({
    title: new FormControl("",[Validators.required,Validators.minLength(3)]),
  })
  paramSub:any;
  CategorySub:any;
  addSub:any;
  editSub:any;
  CategoryId:number = 0;
  Category: any = {};
  constructor(
    public categoryService:CategoryService,
    public router:Router,
    public activeRoute:ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.paramSub = this.activeRoute.params.subscribe({
      next:(data)=>{
        this.CategoryId = data['id'];
        this.getTitle.setValue("");
      }
    })
    if(this.CategoryId != 0){
      this.CategorySub = this.categoryService.getCategory(this.CategoryId).subscribe({
        next:(data)=>{
          this.Category = data;
          this.getTitle.setValue(this.Category.title);
        }
      });
    }
  }
  get getTitle() {
    return this.CategoryData.controls['title'];
  }
  submit() {
    if(this.CategoryData.status == "VALID"){
      if(this.CategoryId == 0){
        this.addSub = this.categoryService.addCategory(this.CategoryData.value).subscribe({
          next:(data)=>{
            console.log(data);
            this.router.navigate(['/categories']);
          }
        });
      }else{
        this.Category.title = this.CategoryData.value.title;
        this.editSub = this.categoryService.updateCategory(this.CategoryId,this.Category).subscribe({
          next:(data)=>{
            console.log(data);
            this.router.navigate(['/categories']);
          },
          error:(err)=> {
            console.log(this.CategoryId,this.Category);
            console.log(err);
          },
        });
      }
    }
    
  }
  ngOnDestroy(): void {
    if(this.paramSub) this.paramSub.unsubscribe();
    if(this.CategorySub) this.CategorySub.unsubscribe();
    if(this.addSub) this.addSub.unsubscribe();
    if(this.editSub) this.editSub.unsubscribe();
  }
}
