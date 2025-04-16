import { Component } from '@angular/core';
import { StoreCurrentUserService } from '../../services/store-current-user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
  public today: number = Date.now();
  public appName: string;

  constructor(private storeCurrentUserService: StoreCurrentUserService) {
    const currentUser = this.storeCurrentUserService.getCurrentUser;
    this.appName = currentUser?.tenant.application as string;
  }

}
