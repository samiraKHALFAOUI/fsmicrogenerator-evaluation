import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from 'src/app/shared/services/defaultServices/auth.service';
import { SecureStorageService } from '../services/defaultServices/secureStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,
    private secureStorage: SecureStorageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot) {
    this.authService.canAccess = false;
    if (!this.authService.isLoggedIn()) {
      if (this.authService.firstEnter) this.router.navigate(['/login']);
      this.authService.canAccess = false;
    } else {
      if (this.authService.firstEnter) {
        if (
          (this.secureStorage.getItem('expiresIn',true) || 0) - Date.now() <=
          this.authService.timeToRefreshToken
        ) {
          this.authService.addEventListener();
        } else {
          setTimeout(() => {
            this.authService.addEventListener();
          }, (this.secureStorage.getItem('expiresIn',true) || 0) - this.authService.timeToRefreshToken - Date.now());
        }
      }
      let mySpaces = this.secureStorage.getItem('user',true)?.groupe?.espaces;
      if (mySpaces) {
        let url = snapshot.url;

        if (route.params && Object.keys(route.params).length) {
          for (let key of Object.keys(route.params)) {
            url = url.replace(route.params[key], ':' + key);
          }
        }
        if (route.queryParams && Object.keys(route.queryParams).length) {

          url = url.replace(/[?].*/g, '');

        }

        if (mySpaces) {
          if (
            mySpaces.find(
              (e: any) => url === '/' + e.path || url + '/' === '/' + e.path
            )
          )
            this.authService.canAccess = true;
          else this.authService.canAccess = false;
        }
      }
      this.authService.firstEnter = false;
    }

    return this.authService.canAccess;
  }
}
