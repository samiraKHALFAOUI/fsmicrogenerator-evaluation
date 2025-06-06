import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/defaultServices/auth.service';
import { SecureStorageService } from '../services/defaultServices/secureStorage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService,
    private secureStorage: SecureStorageService,
  ) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.secureStorage.clear(true);
    }

    return true;
  }
}
