import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    const options = {
      headers: this.createHeaders(),
      params,
    };

    return this.http
      .get<T>(`${this.apiUrl}/${path}`, options)
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    const options = {
      headers: this.createHeaders(),
    };

    return this.http
      .post<T>(`${this.apiUrl}/${path}`, body, options)
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    const options = {
      headers: this.createHeaders(),
    };

    return this.http
      .put<T>(`${this.apiUrl}/${path}`, body, options)
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: any = {}): Observable<T> {
    const options = {
      headers: this.createHeaders(),
    };

    return this.http
      .patch<T>(`${this.apiUrl}/${path}`, body, options)
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string): Observable<T> {
    const options = {
      headers: this.createHeaders(),
    };

    return this.http
      .delete<T>(`${this.apiUrl}/${path}`, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error("API error:", error);


    return throwError(() => error);
  }
}
