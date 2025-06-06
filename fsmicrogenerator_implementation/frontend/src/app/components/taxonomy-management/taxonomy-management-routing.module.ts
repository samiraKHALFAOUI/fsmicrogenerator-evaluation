import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListDomainComponent } from "./domain-management/list-domain/list-domain.component";
import { TranslateDomainComponent } from "./domain-management/translate-domain/translate-domain.component";
import { AddDomainComponent } from "./domain-management/add-domain/add-domain.component";
import { DetailDomainComponent } from "./domain-management/detail-domain/detail-domain.component";
import { DomainResolver } from "src/app/shared/resolvers/TaxonomyManagement/domain.resolver";
import { ListTaxonomyComponent } from "./taxonomy-management/list-taxonomy/list-taxonomy.component";
import { TranslateTaxonomyComponent } from "./taxonomy-management/translate-taxonomy/translate-taxonomy.component";
import { AddTaxonomyComponent } from "./taxonomy-management/add-taxonomy/add-taxonomy.component";
import { DetailTaxonomyComponent } from "./taxonomy-management/detail-taxonomy/detail-taxonomy.component";
import { TaxonomyResolver } from "src/app/shared/resolvers/TaxonomyManagement/taxonomy.resolver";
const routes: Routes = [
  {
    path: "domain",
    children: [
      {
        path: "",
        component: ListDomainComponent,
        data: {
          title: "code_18463",
          breadcrumb: "code_18463",
          breadcrumbURLs: [],
          service: "domain",
          type: "list",
        },
        resolve: {
          dataR: DomainResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddDomainComponent,
        data: {
          title: "code_17086",
          breadcrumb: "code_18463/code_17086",
          breadcrumbURLs: ["/TaxonomyManagements/domain"],
          service: "domain",
          type: "add",
        },
        resolve: {
          dataR: DomainResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddDomainComponent,
        data: {
          title: "code_18464",
          breadcrumb: "code_18463/code_18464",
          breadcrumbURLs: ["/TaxonomyManagements/domain"],
          service: "domain",
          type: "edit",
        },
        resolve: {
          dataR: DomainResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailDomainComponent,
        data: {
          title: "code_18465",
          breadcrumb: "code_18463/code_18465",
          breadcrumbURLs: ["/TaxonomyManagements/domain"],
          service: "domain",
          type: "detail",
        },
        resolve: {
          dataR: DomainResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateDomainComponent,
        data: {
          title: "code_18466",
          breadcrumb: "code_18463/code_18466",
          breadcrumbURLs: ["/TaxonomyManagements/domain"],
          service: "domain",
          type: "translate",
        },
        resolve: {
          dataR: DomainResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18456",
      type: "domain",
      breadcrumb: "code_18456",
      breadcrumbURLs: [""],
      module: "TaxonomyManagement",
    },
  },
  {
    path: "taxonomy",
    children: [
      {
        path: "",
        component: ListTaxonomyComponent,
        data: {
          title: "code_18468",
          breadcrumb: "code_18468",
          breadcrumbURLs: [],
          service: "taxonomy",
          type: "list",
        },
        resolve: {
          dataR: TaxonomyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddTaxonomyComponent,
        data: {
          title: "code_4229",
          breadcrumb: "code_18468/code_4229",
          breadcrumbURLs: ["/TaxonomyManagements/taxonomy"],
          service: "taxonomy",
          type: "add",
        },
        resolve: {
          dataR: TaxonomyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddTaxonomyComponent,
        data: {
          title: "code_18469",
          breadcrumb: "code_18468/code_18469",
          breadcrumbURLs: ["/TaxonomyManagements/taxonomy"],
          service: "taxonomy",
          type: "edit",
        },
        resolve: {
          dataR: TaxonomyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailTaxonomyComponent,
        data: {
          title: "code_18470",
          breadcrumb: "code_18468/code_18470",
          breadcrumbURLs: ["/TaxonomyManagements/taxonomy"],
          service: "taxonomy",
          type: "detail",
        },
        resolve: {
          dataR: TaxonomyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateTaxonomyComponent,
        data: {
          title: "code_18086",
          breadcrumb: "code_18468/code_18086",
          breadcrumbURLs: ["/TaxonomyManagements/taxonomy"],
          service: "taxonomy",
          type: "translate",
        },
        resolve: {
          dataR: TaxonomyResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_10321",
      type: "taxonomy",
      breadcrumb: "code_10321",
      breadcrumbURLs: [""],
      module: "TaxonomyManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxonomyManagementRoutingModule {}
