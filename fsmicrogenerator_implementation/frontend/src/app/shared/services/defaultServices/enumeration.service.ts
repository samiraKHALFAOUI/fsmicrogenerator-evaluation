import { Injectable } from '@angular/core';
import { HelpersService } from './helpers.service';

@Injectable({
  providedIn: 'root'
})
export class EnumerationService {
  etatDePublication: any = [
    "code_541" /*"en cours de création"*/,
    "code_223" /*"en attente de validation"*/,
    "code_3516" /*"en cours de validation "*/,
    "code_550" /*"à corriger"*/,
    "code_318" /*"en cours de correction"*/,
    "code_11201" /*"en attente de publication"*/,
    "code_3417" /*"en cours de publication"*/,
  ]

  salutation: any = [
    "code_1232" /*M.*/ ,
    "code_1233" /*Mme.*/];


  constructor(private helpers: HelpersService) {
    Promise.all(
      [
        this.helpers.translateValues(this.etatDePublication),
        this.helpers.translateValues(this.salutation)
      ]
    )
      .then((result) => {
        this.etatDePublication.splice(0, this.etatDePublication.length, ...result[0]);
        this.salutation.splice(0, this.salutation.length, ...result[1]);

      })
      .catch((error) => {
        console.error("error", error);
      });

  }
}
