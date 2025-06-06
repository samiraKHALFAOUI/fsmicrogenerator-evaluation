import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListCategoryComponent } from "./gestion-category/list-category/list-category.component";
import { TranslateCategoryComponent } from "./gestion-category/translate-category/translate-category.component";
import { AddCategoryComponent } from "./gestion-category/add-category/add-category.component";
import { DetailCategoryComponent } from "./gestion-category/detail-category/detail-category.component";
import { CategoryResolver } from "src/app/shared/resolvers/ProductManagement/category.resolver";
import { ListProductComponent } from "./gestion-product/list-product/list-product.component";
import { TranslateProductComponent } from "./gestion-product/translate-product/translate-product.component";
import { AddProductComponent } from "./gestion-product/add-product/add-product.component";
import { CloneProductComponent } from "./gestion-product/clone-product/clone-product.component";
import { DetailProductComponent } from "./gestion-product/detail-product/detail-product.component";
import { ProductResolver } from "src/app/shared/resolvers/ProductManagement/product.resolver";
const routes: Routes = [
  {
    path: "category",
    children: [
      {
        path: "",
        component: ListCategoryComponent,
        data: {
          title: "code_18402",
          breadcrumb: "code_18402",
          breadcrumbURLs: [],
          service: "category",
          type: "list",
        },
        resolve: {
          dataR: CategoryResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddCategoryComponent,
        data: {
          title: "code_18403",
          breadcrumb: "code_18402/code_18403",
          breadcrumbURLs: ["/ProductManagements/category"],
          service: "category",
          type: "add",
        },
        resolve: {
          dataR: CategoryResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddCategoryComponent,
        data: {
          title: "code_18404",
          breadcrumb: "code_18402/code_18404",
          breadcrumbURLs: ["/ProductManagements/category"],
          service: "category",
          type: "edit",
        },
        resolve: {
          dataR: CategoryResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailCategoryComponent,
        data: {
          title: "code_18405",
          breadcrumb: "code_18402/code_18405",
          breadcrumbURLs: ["/ProductManagements/category"],
          service: "category",
          type: "detail",
        },
        resolve: {
          dataR: CategoryResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateCategoryComponent,
        data: {
          title: "code_18408",
          breadcrumb: "code_18402/code_18408",
          breadcrumbURLs: ["/ProductManagements/category"],
          service: "category",
          type: "translate",
        },
        resolve: {
          dataR: CategoryResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18390",
      type: "category",
      breadcrumb: "code_18390",
      breadcrumbURLs: [""],
      module: "ProductManagement",
    },
  },
  {
    path: "product",
    children: [
      {
        path: "",
        component: ListProductComponent,
        data: {
          title: "code_17514",
          breadcrumb: "code_17514",
          breadcrumbURLs: [],
          service: "product",
          type: "list",
        },
        resolve: {
          dataR: ProductResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddProductComponent,
        data: {
          title: "code_18410",
          breadcrumb: "code_17514/code_18410",
          breadcrumbURLs: ["/ProductManagements/product"],
          service: "product",
          type: "add",
        },
        resolve: {
          dataR: ProductResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddProductComponent,
        data: {
          title: "code_18411",
          breadcrumb: "code_17514/code_18411",
          breadcrumbURLs: ["/ProductManagements/product"],
          service: "product",
          type: "edit",
        },
        resolve: {
          dataR: ProductResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "clone/:id",
        component: CloneProductComponent,
        data: {
          title: "code_18414",
          breadcrumb: "code_17514/code_18414",
          breadcrumbURLs: ["/ProductManagements/product"],
          service: "product",
          type: "clone",
        },
        resolve: {
          dataR: ProductResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailProductComponent,
        data: {
          title: "code_18412",
          breadcrumb: "code_17514/code_18412",
          breadcrumbURLs: ["/ProductManagements/product"],
          service: "product",
          type: "detail",
        },
        resolve: {
          dataR: ProductResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateProductComponent,
        data: {
          title: "code_18413",
          breadcrumb: "code_17514/code_18413",
          breadcrumbURLs: ["/ProductManagements/product"],
          service: "product",
          type: "translate",
        },
        resolve: {
          dataR: ProductResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18393",
      type: "product",
      breadcrumb: "code_18393",
      breadcrumbURLs: [""],
      module: "ProductManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductManagementRoutingModule {}
