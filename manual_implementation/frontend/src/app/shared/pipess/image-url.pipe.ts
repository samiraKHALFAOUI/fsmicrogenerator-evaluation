import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return './../../../assets/images/default-avatar.png'; // Default fallback
    }
  
    if (imageUrl.startsWith('/uploads')) {
      return `${environment.apiUrl}${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      return `${environment.apiUrl}uploads/${imageUrl}`;
    }
  
    return imageUrl;
  }
  
  
}
