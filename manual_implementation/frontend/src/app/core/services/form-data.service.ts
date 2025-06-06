import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor() { }

   transformToFormData (data: any, title: string, file: any,): FormData {
    let formData = new FormData();
    for (let key of Object.keys(data)) {
      if (data.hasOwnProperty(key) && data[key] !== undefined) {
        formData.set(key, JSON.stringify(data[key]));
      }
    }
    if (file) {

      formData.set(title, file);

      file = null;

    }

    return formData;
  }
}
