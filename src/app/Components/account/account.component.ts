import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../Services/account.service';
import { ProfileService } from '../../Services/profile.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  data:any;
  token:any;
  role:any;
  constructor(public account:ProfileService) {}
  ngOnInit(): void {
    this.account.getProfile().subscribe({
      next:(data)=>{
        this.data = data
      },
      error:(err)=>{
        console.log(err)
      }
    })
    
  }
}
