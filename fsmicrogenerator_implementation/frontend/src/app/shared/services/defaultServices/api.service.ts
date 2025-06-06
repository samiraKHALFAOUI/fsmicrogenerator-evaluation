import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { SecureStorageService } from './secureStorage.service';

export const API = environment.apiUrl ||  'http://localhost:4000/api';


@Injectable({
  providedIn: 'root',
})
export class RequestHeaderService {
  constructor( private secureStorage: SecureStorageService) {
  }
  getHeaders(headers: any = {} ) {
    let header = {
      lang: this.secureStorage.getItem('lang') || 'fr',
      defLang: this.secureStorage.getItem('defLang') || 'fr',
      ...headers,
    };
    const token = this.secureStorage.getItem('token',true)
    if (token)
      header.jwt = token;

    return new HttpHeaders(header);
  }
}

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private http: HttpClient,
    private authService: AuthService,
    private secureStorage: SecureStorageService,
    private requestHeaderService : RequestHeaderService
  ) {
  }

  get<T = any>(url: string, headers: { [name: string]: any } = {}) {
    return this.http
      .get<T>(`${API}${url.startsWith('/') ? url : `/${url}`}`, {
        headers: this.requestHeaderService.getHeaders(headers),
      })
      .pipe(
        catchError((error: any) => {
          if (
            [
              'jwt must be provided',
              'jwt expired',
              'invalid algorithm',
              'invalid signature',
            ].includes(error?.error?.error?.message || error?.error?.message)
          ) {
            this.secureStorage.removeItem('token',true);
            this.authService.showInvalidTokenModel = true;
            this.authService.errorDialog = {
              message: error.error.message,
              statusText: error.statusText,
            };
          }
          return throwError(() => error);
        })
      );
  }

  post<T = any>(url: string, body: any, headers: { [name: string]: any } = {}) {
    return this.http
      .post<T>(`${API}${url.startsWith('/') ? url : `/${url}`}`, body, {
        headers: this.requestHeaderService.getHeaders(headers),
      })
      .pipe(
        catchError((error: any) => {
          if (
            [
              'jwt must be provided',
              'jwt expired',
              'invalid algorithm',
              'invalid signature',
            ].includes(error?.error?.error?.message || error?.error?.message)
          ) {
            this.secureStorage.removeItem('token',true);
            this.authService.showInvalidTokenModel = true;
            this.authService.errorDialog = {
              message: error.error.message,
              statusText: error.statusText,
            };
          }

          return throwError(() => error);
        })
      );
  }

  patch<T = any>(
    url: string,
    body: any,
    headers: { [name: string]: string } = {}
  ) {
    return this.http
      .patch<T>(`${API}${url.startsWith('/') ? url : `/${url}`}`, body, {
        headers: this.requestHeaderService.getHeaders(headers),
      })
      .pipe(
        catchError((error: any) => {
          if (
            [
              'jwt must be provided',
              'jwt expired',
              'invalid algorithm',
              'invalid signature',
            ].includes(error?.error?.error?.message || error?.error?.message)
          ) {
            this.secureStorage.removeItem('token',true);
            this.authService.showInvalidTokenModel = true;
            this.authService.errorDialog = {
              message: error.error.message,
              statusText: error.statusText,
            };
          }

          return throwError(() => error);
        })
      );
  }


}



