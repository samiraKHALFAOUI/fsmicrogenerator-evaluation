import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListLangueSiteComponent } from "./gestion-langue-site/list-langue-site/list-langue-site.component";
import { TranslateLangueSiteComponent } from "./gestion-langue-site/translate-langue-site/translate-langue-site.component";
import { AddLangueSiteComponent } from "./gestion-langue-site/add-langue-site/add-langue-site.component";
import { DetailLangueSiteComponent } from "./gestion-langue-site/detail-langue-site/detail-langue-site.component";
import { LangueSiteResolver } from "src/app/shared/resolvers/TechnicalConfiguration/langue-site.resolver";
import { ListEnumerationComponent } from "./gestion-enumeration/list-enumeration/list-enumeration.component";
import { TranslateEnumerationComponent } from "./gestion-enumeration/translate-enumeration/translate-enumeration.component";
import { TranslateMultipleEnumerationComponent } from './gestion-enumeration/translate-multiple-enumeration/translate-multiple-enumeration.component';
import { AddEnumerationComponent } from "./gestion-enumeration/add-enumeration/add-enumeration.component";
import { DetailEnumerationComponent } from "./gestion-enumeration/detail-enumeration/detail-enumeration.component";
import { EnumerationResolver } from "src/app/shared/resolvers/TechnicalConfiguration/enumeration.resolver";
import { MenuResolver } from "src/app/shared/resolvers/TechnicalConfiguration/menu.resolver";
import { AddMenuComponent } from "./gestion-menu/add-menu/add-menu.component";
import { DetailMenuComponent } from "./gestion-menu/detail-menu/detail-menu.component";
import { ListMenuComponent } from "./gestion-menu/list-menu/list-menu.component";
import { TranslateMenuComponent } from "./gestion-menu/translate-menu/translate-menu.component";

const routes: Routes = [
  {
    path: 'menu',
    children: [
      {
        path: '',
        component: ListMenuComponent,
        data: {
          title: 'code_13937',
          breadcrumb: 'code_13937',
          breadcrumbURLs: [],
          service: 'menu',
          type: 'list',
          option: 'code_13934',
        },
        resolve: {
          dataR: MenuResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'add',
        component: AddMenuComponent,
        data: {
          title: 'code_3854',
          breadcrumb: 'code_13937/code_3854',
          breadcrumbURLs: ['/TechnicalConfiguration/menu'],
          service: 'menu',
          type: 'add',
        },
        resolve: {
          dataR: MenuResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: AddMenuComponent,
        data: {
          title: 'code_3865',
          breadcrumb: 'code_13937/code_3865',
          breadcrumbURLs: ['/TechnicalConfiguration/menu'],
          service: 'menu',
          type: 'edit',
        },
        resolve: {
          dataR: MenuResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'detail/:id',
        component: DetailMenuComponent,
        data: {
          title: 'code_13938',
          breadcrumb: 'code_13937/code_13938',
          breadcrumbURLs: ['/TechnicalConfiguration/menu'],
          service: 'menu',
          type: 'detail',
        },
        resolve: {
          dataR: MenuResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'translate/:id',
        component: TranslateMenuComponent,
        data: {
          title: 'code_13939',
          breadcrumb: 'code_13937/code_13939',
          breadcrumbURLs: ['/TechnicalConfiguration/menu'],
          service: 'menu',
          type: 'translate',
        },
        resolve: {
          dataR: MenuResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: 'code_4238',
      type: 'menu',
      breadcrumb: 'code_4238',
      breadcrumbURLs: [''],
      module: 'TechnicalConfiguration',
    },
  },
  {
    path: "langueSite",
    children: [
      {
        path: "",
        component: ListLangueSiteComponent,
        data: {
          title: "code_4659",
          breadcrumb: "code_4659",
          breadcrumbURLs: [],
          service: "langueSite",
          type: "list",
        },
        resolve: {
          dataR: LangueSiteResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddLangueSiteComponent,
        data: {
          title: "code_4660",
          breadcrumb: "code_4659/code_4660",
          breadcrumbURLs: ["/TechnicalConfigurations/langueSite"],
          service: "langueSite",
          type: "add",
        },
        resolve: {
          dataR: LangueSiteResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddLangueSiteComponent,
        data: {
          title: "code_4661",
          breadcrumb: "code_4659/code_4661",
          breadcrumbURLs: ["/TechnicalConfigurations/langueSite"],
          service: "langueSite",
          type: "edit",
        },
        resolve: {
          dataR: LangueSiteResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailLangueSiteComponent,
        data: {
          title: "code_4662",
          breadcrumb: "code_4659/code_4662",
          breadcrumbURLs: ["/TechnicalConfigurations/langueSite"],
          service: "langueSite",
          type: "detail",
        },
        resolve: {
          dataR: LangueSiteResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateLangueSiteComponent,
        data: {
          title: "code_17573",
          breadcrumb: "code_4659/code_17573",
          breadcrumbURLs: ["/TechnicalConfigurations/langueSite"],
          service: "langueSite",
          type: "translate",
        },
        resolve: {
          dataR: LangueSiteResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_17566",
      type: "langueSite",
      breadcrumb: "code_17566",
      breadcrumbURLs: [""],
      module: "TechnicalConfiguration",
    },
  },
  {
    path: "enumeration",
    children: [
      {
        path: "",
        component: ListEnumerationComponent,
        data: {
          title: "code_17574",
          breadcrumb: "code_17574",
          breadcrumbURLs: [],
          service: "enumeration",
          type: "list",
        },
        resolve: {
          dataR: EnumerationResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddEnumerationComponent,
        data: {
          title: "code_17575",
          breadcrumb: "code_17574/code_17575",
          breadcrumbURLs: ["/TechnicalConfigurations/enumeration"],
          service: "enumeration",
          type: "add",
        },
        resolve: {
          dataR: EnumerationResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddEnumerationComponent,
        data: {
          title: "code_17576",
          breadcrumb: "code_17574/code_17576",
          breadcrumbURLs: ["/TechnicalConfigurations/enumeration"],
          service: "enumeration",
          type: "edit",
        },
        resolve: {
          dataR: EnumerationResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailEnumerationComponent,
        data: {
          title: "code_17577",
          breadcrumb: "code_17574/code_17577",
          breadcrumbURLs: ["/TechnicalConfigurations/enumeration"],
          service: "enumeration",
          type: "detail",
        },
        resolve: {
          dataR: EnumerationResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateEnumerationComponent,
        data: {
          title: "code_17578",
          breadcrumb: "code_17574/code_17578",
          breadcrumbURLs: ["/TechnicalConfigurations/enumeration"],
          service: "enumeration",
          type: "translate",
        },
        resolve: {
          dataR: EnumerationResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translateMany",
        component: TranslateMultipleEnumerationComponent,
        data: {
          title: "code_17578",
          breadcrumb: "code_17574/code_17578",
          breadcrumbURLs: ["/TechnicalConfigurations/enumeration"],
          service: "enumeration",
          type: "translate",
        },
        resolve: {
          dataR: EnumerationResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_17568",
      type: "enumeration",
      breadcrumb: "code_17568",
      breadcrumbURLs: [""],
      module: "TechnicalConfiguration",
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicalConfigurationRoutingModule { }
