import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';
import { EventEmitter, Injectable, Injector } from "@angular/core";

import { Route, Router } from "@angular/router";
import { TreeNode } from "primeng/api";
import { Menu } from "src/app/shared/models/TechnicalConfiguration/Menu.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  menuUrl = `/technicalConfigurationService/menus`;
  typeAffichage: any = [
    "code_13884",
    "code_13883",
    "code_2021",
    "code_187",
    "code_13926",
    "code_13927",
  ];
  typeActivation: any = ["code_1960", "code_1962" /*, 'code_1963'*/];
  type: any = ["code_13934", "code_5041", "code_13994"];
  etatDePublication: any = [
    "code_541",
    "code_223",
    "code_224",
    "code_11201",
    "code_3417",
  ];
  typeSelect: any = [
    "code_13897",
    "code_13898",
    "code_13899",
    "code_13900",
    "code_13901",
  ];
  constructor(
    private router: Router,
    private injector: Injector,
    private apiService: APIService,
    private helpers: HelpersService,
    private secureStorage : SecureStorageService
  ) {
    //translate i18n values for dropdown options
    Promise.all(
      [
        this.helpers.translateValues(this.typeAffichage),
        this.helpers.translateValues(this.typeActivation),
        this.helpers.translateValues(this.type),
        this.helpers.translateValues(this.etatDePublication),
        this.helpers.translateValues(this.typeSelect),
      ]
    )
      .then((result) => {
        this.typeAffichage.splice(0, this.typeAffichage.length, ...result[0]);
        this.typeActivation.splice(0, this.typeActivation.length, ...result[1]);
        this.type.splice(0, this.type.length, ...result[2]);
        this.etatDePublication.splice(0, this.etatDePublication.length, ...result[3]);
        this.typeSelect.splice(0, this.typeSelect.length, ...result[4]);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getMenus(params?: { [key: string]: any }) {
    return this.apiService.get<Menu[]>(
      `${this.menuUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getMenuById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Menu>(
      `${this.menuUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  addMenu(menu: any) {
    return this.apiService.post<Menu>(`${this.menuUrl}`, menu);
  }

  addManyMenu(menu: any) {
    return this.apiService.post<Menu[]>(`${this.menuUrl}/many`, menu);
  }

  getMenuForTranslation(id: string) {
    return this.apiService.get<Menu>(`${this.menuUrl}/translate/${id}`);
  }

  translateMenu(id: string, menu: any) {
    return this.apiService.patch<{ message: string; data: Menu }>(
      `${this.menuUrl}/translate/${id}`,
      menu
    );
  }

  updateMenu(id: string, menu: any) {
    return this.apiService.patch<{ message: string; data: Menu }>(
      `${this.menuUrl}/${id}`,
      menu
    );
  }

  updateManyMenu(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.menuUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(`${this.menuUrl}/`, data);
  }
  menuItemsToTree(menu: any[]) {
    let menuNodes: any = menu.map((menu: any) => {
      return this.menuItemToTreeNode(menu);
    });

    return menuNodes;
  }

  menuItemToTreeNode(menu: any): TreeNode {
    let tempMenu: any = {
      data: menu,
      children: [],
    };

    if (menu.children?.length) {
      menu.children = menu.children.sort(
        (a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite
      );
      for (let t of menu.children) {
        tempMenu.children.push(this.menuItemToTreeNode(t));
      }
    }

    if (menu.menuAssocies?.length) {
      menu.menuAssocies = menu.menuAssocies.sort(
        (a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite
      );
      for (let t of menu.menuAssocies) {
        tempMenu.children.push(this.menuItemToTreeNode(t));
      }
    }

    return tempMenu;
  }
  ee: EventEmitter<number> = new EventEmitter<number>();
  counter = 0;
  espaces: any = [];
  getEspaces() {
    this.counter = 0;
    this.espaces = [];
    let contentRoute = null;
    let children: any = [];
    contentRoute = this.router.config.find(
      (r: any) => r.data && r.data.type === "content"
    );
    if (contentRoute && contentRoute.children?.length) {
      children = contentRoute.children.filter(
        (r: any) => r.data && r.data.menu === true
      );
      this.ee.subscribe((data) => {
        if (data === children.length) {
          let espName = this.helpers
            .flatDeep(this.espaces, "children")
            .map((e: any) => e.espace);
          Promise.all([this.helpers.translateValues(espName)]).then(
            (result: any) => {
              this.helpers
                .flatDeep(this.espaces, "children")
                .map(
                  (e: any) =>
                    (e.label = result[0].find(
                      (t: any) => t.value === e.espace
                    ).label)
                );
              this.secureStorage.setItem(
                "global_espace",
                this.espaces,
                true
              );
            }
          );
        }
      });
      for (let [i, c] of children.entries()) {
        this.getChildren(c, i);
      }
    }
    return this.espaces;
  }

  async getChildren(route: Route, index: number) {
    let i = index;
    let children: any;

    if (route.loadChildren) {

      await (<any>this.router).navigationTransitions.configLoader
        .loadChildren(this.injector, route)
        .subscribe((res: any) => {
          let routeModule: any = {};
          children = [];
          const recF = (route: any, parent: any) => {
            let newRoute: any = {};
            newRoute.path = `${parent}/${route.path}`;
            newRoute.data = this.helpers.newObject(route.data);
            // this.translateTitle(route.data)
            if (route.children?.length) {
              newRoute.children = [];
              route.children.map((r: any) =>
                newRoute.children.push(
                  recF(r, parent ? parent + "/" + route.path : route.path)
                )
              );
            }
            return newRoute;
          };
          res.routes.map((r: any) => {
            if (r.data.module === route.data?.["module"])
              children.push(recF(r, route.path));
          });
          routeModule = {
            path: route.path,
            data: this.helpers.newObject(route.data),
            children,
          };
          this.espaces.push(this.transformData(routeModule, index));
          this.ee.emit(++this.counter);
        });
    } else {
      this.espaces.push(
        this.transformData(
          { path: route.path, data: this.helpers.newObject(route.data) },
          index
        )
      );
      this.ee.emit(++this.counter);
    }
  }
  transformData(data: any, index: number) {
    let i = index;

    const recF = (route: any, module: any = null, option: any = null) => {
      let menuItem: any = {};
      menuItem = {
        _id: index++,
        espace: route.data.title,
        path: route.path,
        type: route.data.type,
        service: route.data.service,
        children: [],
        isModule: route.data.type === "module" ? true : false,
        serviceConfig: {},
      };
      if (module) menuItem.serviceConfig.service = module;
      if (!menuItem.isModule) {
        menuItem.serviceConfig.classe = route.data.service || route.data.type;
      }
      if (route.data.option || option) {
        menuItem.serviceConfig.option = route.data.option || option;
      }

      route.children?.map((child: any) => {
        // module = route.data.type === 'module' ? route.data.path : module
        menuItem.children.push(recF(child, module, menuItem.option));
      });

      return menuItem;
    };

    return recF(data, data.data.type === "module" ? data.path : null);
  }
  getOneMenu(params?: { [key: string]: any }) {
    return this.apiService.get<Menu>(
      `${this.menuUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }
  getStatistiquesMenu(configuration: any) {
    return this.apiService.post<any>(
      `${this.menuUrl}/statistiques`,
      configuration
    );
  }

  espacesToTree(espace: any[]) {
    let espaceNodes: any = espace.map((espace: any) => {
      espace = this.espaceToTreeNode(espace);

      return espace;
    });

    return espaceNodes;
  }

  espaceToTreeNode(espace: any): TreeNode {
    let tempespace: any = {
      data: {
        _id: espace._id,
        espace: espace.espace,
        type: espace.type,
        path: espace.path,
        canAccess: false,
      },
      children: [],
    };
    if (espace.children?.length) {
      for (let t of espace.children) {
        tempespace.children.push(this.espaceToTreeNode(t));
      }
    }

    return tempespace;
  }
}
