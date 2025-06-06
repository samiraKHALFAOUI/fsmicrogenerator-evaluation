import { Injectable } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/models/defaultModels/breadcrumb-item';
import { SecureStorageService } from './secureStorage.service';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private breadcrumbs: BreadcrumbItem[] = [];
  routes: any[] = [];

  constructor(private secureStorage: SecureStorageService
  ) {
    this.routes = this.secureStorage.getItem("global_espace", true) || [];

  }
  getBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbs;
  }

  addBreadcrumb(item: BreadcrumbItem[]): void {
    this.breadcrumbs.push(...item);
  }

  removeBreadcrumb(): void {
    this.breadcrumbs.pop();
    this.breadcrumbs.pop();
  }
  getRoute(module: string, component: string, operation: string) {
    let items = [];
    if (!this.routes.length) {
      this.routes = this.secureStorage.getItem("global_espace", true) || [];
    }
    if (this.routes.length) {
      items = this.routes.find(
        (r: any) => r.path === `${module}` || r.path === `${module}s`
      )?.children;
      if (items?.length) {
        items = items.find((r: any) => r.type === component)?.children;
      }
      if (items?.length) {
        items = items.filter((r: any) => ["list", operation].includes(r.type));
      }
    } else {
    }
    return items;
  }
  clear(): void {
    this.breadcrumbs.splice(0, this.breadcrumbs.length);
  }
}
