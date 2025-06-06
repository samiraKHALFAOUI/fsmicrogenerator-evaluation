import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API, APIService, RequestHeaderService} from './api.service';
import { User } from 'src/app/shared/models/AccountManagement/User.model';
import { HelpersService } from './helpers.service';
import { SecureStorageService } from './secureStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUrl = `${API}/authentication`;
  timeToRefreshToken = 300000; // in milliseconds
  firstEnter = true;
  showInvalidTokenModel = false;
  sendRefreshToken = false;
  errorDialog = {
    message: '',
    statusText: '',
  };
  loginError = {
    errorDialogText: '',
    showErrorDialog: false,
  };
  canAccess = true;


  windowEventMousemove: any;

  windowEventKeyup: any;

  timeoutToShowExpiredTokenModal: any = -1;

  constructor(private http: HttpClient, private router: Router,
    private helpers: HelpersService,
    private secureStorage: SecureStorageService,
    private apiService : RequestHeaderService
  ) {
    this.windowEventMousemove = this.refreshToken.bind(this);
    this.windowEventKeyup = this.refreshToken.bind(this);
  }

  private refreshToken() {


    (this.secureStorage.getItem('expiresIn', true) || 0) - Date.now() <=
      this.timeToRefreshToken &&
      this.sendRefreshToken === false &&
      ((this.sendRefreshToken = true),
        this.http
          .get(`${API}/authentication/token`, { headers: this.apiService.getHeaders() })
          .subscribe({
            next: ({ token, expiresIn }: any) => {

              this.secureStorage.setItem('token', token, true);
              this.secureStorage.setItem('expiresIn', expiresIn, true);
              this.clearEvents();
              clearTimeout(this.timeoutToShowExpiredTokenModal);
              this.timeoutToShowExpiredTokenModal = setTimeout(() => {
                this.addEventListener();
              }, (this.secureStorage.getItem('expiresIn', true) || 0) - this.timeToRefreshToken - Date.now());
              this.sendRefreshToken = false;
            },
            error: (error) => { },
          }));
  }

  addEventListener() {
    clearTimeout(this.timeoutToShowExpiredTokenModal);
    document.body.addEventListener(
      'mousemove',
      this.windowEventMousemove,
      true
    );
    document.body.addEventListener('keyup', this.windowEventKeyup, true);
    this.timeoutToShowExpiredTokenModal = setTimeout(() => {
      this.showInvalidTokenModel = true;
      this.firstEnter = true;
      this.clearEvents();
    }, (this.secureStorage.getItem('expiresIn', true) || 0) - Date.now());
  }

  clearEvents() {
    document.body.removeEventListener('keyup', this.windowEventKeyup, true);
    document.body.removeEventListener(
      'mousemove',
      this.windowEventMousemove,
      true
    );
  }

  login(credentials: { login: string; password: string }) {
    return this.helpers.resolve((res, rej) => {

      this.http
        .post<{ token: string; expiresIn: string; user: User }>(
          `${this.authUrl}`,
          credentials,
          {
            headers: this.apiService.getHeaders(),
          }
        )
        .subscribe({
          next: (success: any) => {
            this.secureStorage.setItem('token', success.token, true);
            this.secureStorage.setItem('expiresIn', success.expiresIn, true);
            this.secureStorage.setItem('user', success.user, true);
            this.firstEnter = false
            res(true)

          },
          error: (error: any) => {
            rej(error)
            this.loginError.errorDialogText = error.error.message;
            this.loginError.showErrorDialog = true;
          },
        });

    })
  }

  isLoggedIn(): boolean | void {
    if (this.secureStorage.getItem('token', true)) {
      if (!this.secureStorage.getItem('expiresIn', true)) return false;

      if (
        // @ts-ignore
        (this.secureStorage.getItem('expiresIn', true) || 0) -
        this.timeToRefreshToken >
        Date.now()
      )
        return true;

      if (
        // @ts-ignore
        (this.secureStorage.getItem('expiresIn', true) || 0) < Date.now()
      ) {
        this.showInvalidTokenModel = true;

        return true;
      }

      return true;
    }

    return false;
  }

  logOut(tokenExpired: boolean = false) {
    let userId = this.secureStorage.getItem('user', true)?._id;
    this.http
      .post(
        `${this.authUrl}/logout`,
        {
          user: userId,
          motif: tokenExpired ? 'code_11503' : 'code_11504',
        },
        {
          headers: this.apiService.getHeaders(),
        }
      )
      .subscribe({
        next: (result: any) => {

          this.secureStorage.clear(true);
          if (!tokenExpired) this.router.navigate(['/login']);
          else
            this.router.navigate(['/login'], {
              queryParams: { backTo: this.router.url },
            });
        },
        error: (err: any) => {
          this.router.navigate(['/login']);
        },
      });
  }

  isAuthorized(config: any) {
    this.canAccess = false;
    if (config) {
      let mySpaces = this.secureStorage.getItem('user', true)?.groupe?.espaces;
      if (mySpaces) {
        let path = `${config.service}/${config.component}/${config.action}`.toLowerCase()
        if (['edit', 'detail', 'clone', 'translate'].includes(config.action))
          path += '/:id'
        this.canAccess = mySpaces.find((item: any) => config.action === 'list' ?
          (item.type === 'list' && item.path.toLowerCase() === `${config.service}/${config.component}/`.toLowerCase())
          : item.path.toLowerCase() === path)?.canAccess
      }
    }
    return this.canAccess;

  }


  sendVerificationEmail(params?: { [key: string]: any }) {
    return this.http.get(
      `${this.authUrl}/send-verification-email?params=${JSON.stringify(
        params || {}
      )}`,
      {
        headers: this.apiService.getHeaders(),
      }
    );
  }
  resetPassword(data?: any) {
    return this.http.post(`${this.authUrl}/resetPassword`, data, {
      headers: this.apiService.getHeaders(),
    });
  }

  updateResetPassword(data?: any) {
    return this.http.patch(`${this.authUrl}/resetPassword`, data, {
      headers: this.apiService.getHeaders(),
    });
  }
}
