import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponent } from './Components/products/products.component';
import { ProductDetailsComponent } from './Components/products/product-details/product-details.component';
import { ProductFormComponent } from './Components/products/product-form/product-form.component';
import { ProductAdminComponent } from './Components/products/product-admin/product-admin.component';
import { CategoryComponent } from './Components/category/category.component';
import { CartComponent } from './Components/cart/cart.component';
import { WishComponent } from './Components/wish/wish.component';
import { CategoryFormComponent } from './Components/category/category-form/category-form.component';
import { AccountComponent } from './Components/account/account.component';
import { LoginComponent } from './Components/account/login/login.component';
import { RegisterComponent } from './Components/account/register/register.component';
import { RegisterAdminComponent } from './Components/account/register-admin/register-admin.component';
import { EditDataComponent } from './Components/account/edit-data/edit-data.component';
import { authGuard } from './Guard/auth.guard';
import { AdminGuard } from './Guard/admin.guard';
import { NotFoundComponent } from './Components/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductsComponent ,canActivate: [authGuard]},
    { path: 'productDash', component: ProductAdminComponent ,canActivate: [AdminGuard]},
    { path: 'products/:id/info', component: ProductDetailsComponent, canActivate: [authGuard]},
    { path: 'products/:id', component: ProductFormComponent, canActivate: [AdminGuard]},
    { path: 'products/:image/:id', component: ProductFormComponent, canActivate: [AdminGuard]},
    { path: 'categories', component: CategoryComponent, canActivate: [AdminGuard]},
    { path: 'categories/:id', component: CategoryFormComponent, canActivate: [AdminGuard]},
    { path: 'cart', component: CartComponent, canActivate: [authGuard]},
    { path: 'wish', component: WishComponent, canActivate: [authGuard]},
    { path: 'profile', component: AccountComponent, canActivate: [authGuard]},
    { path: 'profile/:edit/:id', component: EditDataComponent, canActivate: [authGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin/register', component: RegisterAdminComponent },
    { path: '**', component: NotFoundComponent }
];
