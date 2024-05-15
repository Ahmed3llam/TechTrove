import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IProduct } from '../../../Models/ProductInterfaces/IProduct';
import { ProductService } from '../../../Services/product.service';
import { IProductResponse } from '../../../Models/ProductInterfaces/IProductResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './product-admin.component.html',
  styleUrl: './product-admin.component.css'
})
export class ProductAdminComponent implements OnInit {
  products: IProduct[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 10;
  totalPagesArray: number[] = [];

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response: IProductResponse) => {
        this.products = response.products.$values;
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== id);
          },
          error: (err) => {
            console.log("error",err);
          }
        });
        Swal.fire(
          'Deleted!',
          'This product has been deleted.',
          'success'
        );
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }
}
