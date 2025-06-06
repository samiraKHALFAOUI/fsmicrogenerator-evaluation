import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private messageService: MessageService) { }

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error && error.error.error && error.error.error.message) {
      errorMessage = error.error.error.message;
    } else if (error.error && error.error.errors && error.error.errors.length) {
      // Handle validation errors
      errorMessage = error.error.errors.map((e: any) => e.message).join('. ');
    } else if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please check your internet connection.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized. Please log in.';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to access this resource.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    });
  }
}