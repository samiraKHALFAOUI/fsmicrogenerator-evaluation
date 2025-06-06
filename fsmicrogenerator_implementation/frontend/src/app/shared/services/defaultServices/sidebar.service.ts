import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../TechnicalConfiguration/menu.service';
import { SecureStorageService } from './secureStorage.service';

export interface sidebarItem extends MenuItem {
  _id: string;
  active?: boolean;
  open: boolean;
  items?: sidebarItem[];
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public fullScreen: boolean = false;

  menuItems: sidebarItem[] = [];
  constructor(private menuService: MenuService, private secureStorage: SecureStorageService,
  ) { }

  getMenuItems() {
    if (!this.secureStorage.getItem('global_espace', true)?.length) {
      this.menuService.getEspaces();
    }
    this.menuItems = [];
    const existingMenu = this.secureStorage.getItem('menu', true)
    if (existingMenu && existingMenu.length) {
      this.menuItems = existingMenu;
    } else {
      this.menuService.getMenus({ condition: { actif: true, type: 'code_13934' } }).subscribe((data: any) => {
        let menu: any = [];
        data = data.filter((d: any) => d.etatObjet.includes('code-1'));
        menu = this.menuService.menuItemsToTree(
          data
            .filter((d: any) => d.planPrincipale)
            .sort(
              (a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite
            )
        );

        const recF = (item: any): sidebarItem => {
          let newItem: any = {
            _id: item.data._id,
            routerLink: item.data.path ? '/' + item.data.path : '',
            routerLinkActiveOptions: { exact: true },
            label: item.data.translations.title || item.data.translations.titre,
            icon: item.data.icon,
            active: item.data.megaMenu ? false : true,
            open: item.data.megaMenu ? false : true,
            type: item.data.type
          };
          if (item.children.length) {
            newItem.items = [];
            newItem.expanded = false;
            item.children
              .sort(
                (a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite
              )
              .map((child: any) => {
                newItem.items.push(recF(child));
              });
          }
          return newItem;
        };

        menu.map((item: any) => {
          this.menuItems.push(recF(item));
        });

        this.secureStorage.setItem('menu', this.menuItems, true);
      });
    }

    return this.menuItems;
  }
}
