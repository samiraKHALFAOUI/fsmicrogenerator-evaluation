import { Component, OnInit, DoCheck, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/defaultServices/auth.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent {
  display = false;
  constructor(public authService: AuthService) {}


  isSidebarOpen = true;



  closeTokenDialog(event?: any) {
    if (!event) {
      this.authService.showInvalidTokenModel = false;
      this.authService.logOut(true);
    }
  }
  close() {
    this.display = false;
    this.authService.canAccess = true;
  }

}
