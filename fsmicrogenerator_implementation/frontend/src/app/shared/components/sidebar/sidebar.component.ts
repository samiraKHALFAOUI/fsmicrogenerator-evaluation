import { Component, HostListener, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { filter } from 'rxjs';
import {
  SidebarService,
  sidebarItem,
} from 'src/app/shared/services/defaultServices/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @ViewChildren('menu') menuList!: QueryList<Menu>;
  sidebarClosed: boolean = true;
  sidebarHovered: boolean = false;
  activeItem: any;

  @Input() showSidebar!: boolean;
  showMenu = '';
  showSubMenu = '';
  mobileSize = false;
  sidebarNavItems: sidebarItem[] = [];
  activeItemId: string | null = null;

  constructor(private sidebarService: SidebarService, public router: Router) {
    this.getSideBar();
  }

  ngOnInit() {
    this.handleSidebar();
    this.setActive();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActive();
    });
  }
  getSideBar() {
    this.sidebarNavItems = this.sidebarService.getMenuItems();
    this.resetExpandedState(this.sidebarNavItems);
  }

  resetExpandedState(items: sidebarItem[]) {
    items.forEach(item => {
      item.expanded = false;
      if (item.items && item.items.length > 0) {
        this.resetExpandedState(item.items);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.handleSidebar();
  }

  handleSidebar() {
    this.mobileSize = window.innerWidth < 1170 ? true : false;
  }

  setActive() {
    const currentUrl = this.normalizeUrl(this.router.url);

    const setActiveRecursive = (items: sidebarItem[]): boolean => {
      for (let item of items) {
        if (this.normalizeUrl(item.routerLink) === currentUrl) {
          this.activeItemId = item._id;
          return true;
        }
        if (item.items && setActiveRecursive(item.items)) {
          item.expanded = true;
          return true;
        }
      }
      return false;
    };

    setActiveRecursive(this.sidebarNavItems);
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  closeAllMenus(){
this.menuList.forEach(menu => menu.hide());
}

toggleItem(item: sidebarItem, parentItems?: sidebarItem[]) {
  if (item.items) {
    item.expanded = !item.expanded;

    if (item.expanded && parentItems) {
      parentItems.forEach(siblingItem => {
        if (siblingItem !== item) {
          siblingItem.expanded = false;
        }
      });
    }
  }/* else*/ if (item.routerLink) {
    this.router.navigate([item.routerLink]);
  }
  this.activeItemId = item._id;

}

resetActiveState(items: sidebarItem[]) {
  items.forEach(item => {
    item.active = false;
    if (item.items) {
      this.resetActiveState(item.items);
    }
  });
}

containsActiveRoute(item: sidebarItem): boolean {
  if (this.normalizeUrl(item.routerLink) === this.normalizeUrl(this.router.url)) {
    return true;
  }
  if (item.items) {
    return item.items.some(subItem => this.containsActiveRoute(subItem));
  }
  return false;
}


isActive(item: sidebarItem): boolean {
  return this.normalizeUrl(this.router.url) === this.normalizeUrl(item.routerLink);
}


private normalizeUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}


setActiveItem(item: any) {
  this.activeItem = item;
}

}
