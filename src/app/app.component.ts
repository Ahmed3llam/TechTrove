import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { AdminComponent } from './Components/admin/admin.component';
import { DataServiceService } from './Services/data-service.service';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,AdminComponent,CloudinaryModule],
templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TechTrove';
  role:any;
  private roleSubscription: any;
  img!: CloudinaryImage;

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'drv84xocp',
        apiSecret: 'L1Qn-QnsX-v2wrCvdg-VKA96QT8',
        apiKey: '396988811391246'
      }
    });
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}

