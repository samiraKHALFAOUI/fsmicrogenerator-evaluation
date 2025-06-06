import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListUserComponent } from "./gestion-user/list-user/list-user.component";
import { TranslateUserComponent } from "./gestion-user/translate-user/translate-user.component";
import { AddUserComponent } from "./gestion-user/add-user/add-user.component";
import { CloneUserComponent } from "./gestion-user/clone-user/clone-user.component";
import { DetailUserComponent } from "./gestion-user/detail-user/detail-user.component";
import { UserResolver } from "src/app/shared/resolvers/AccountManagement/user.resolver";
import { ListGroupComponent } from "./gestion-group/list-group/list-group.component";
import { TranslateGroupComponent } from "./gestion-group/translate-group/translate-group.component";
import { AddGroupComponent } from "./gestion-group/add-group/add-group.component";
import { CloneGroupComponent } from "./gestion-group/clone-group/clone-group.component";
import { DetailGroupComponent } from "./gestion-group/detail-group/detail-group.component";
import { GroupResolver } from "src/app/shared/resolvers/AccountManagement/group.resolver";
import { UpdateMyProfileComponent } from "./gestion-profile/update-my-profile/update-my-profile.component";
import { MyProfileComponent } from "./gestion-profile/my-profile/my-profile.component";
const routes: Routes = [
  {
    path: "user",
    children: [
      {
        path: "",
        component: ListUserComponent,
        data: {
          title: "code_10485",
          breadcrumb: "code_10485",
          breadcrumbURLs: [],
          service: "user",
          type: "list",
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddUserComponent,
        data: {
          title: "code_10486",
          breadcrumb: "code_10485/code_10486",
          breadcrumbURLs: ["/AccountManagements/user"],
          service: "user",
          type: "add",
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddUserComponent,
        data: {
          title: "code_18473",
          breadcrumb: "code_10485/code_18473",
          breadcrumbURLs: ["/AccountManagements/user"],
          service: "user",
          type: "edit",
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'profile/:id',
        component: MyProfileComponent,
        data: {
          title: 'code_11280',
          breadcrumb: 'code_10485/code_11280',
          breadcrumbURLs: ['/AccountManagement/user'],
          service: 'compteUser',
          type: 'detail',
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'profile/edit/:id',
        component: UpdateMyProfileComponent,
        data: {
          title: 'code_11424',
          breadcrumb: 'code_10485/code_11424',
          breadcrumbURLs: ['/AccountManagement/user'],
          service: 'compteUser',
          type: 'edit',
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "clone/:id",
        component: CloneUserComponent,
        data: {
          title: "code_10489",
          breadcrumb: "code_10485/code_10489",
          breadcrumbURLs: ["/AccountManagements/user"],
          service: "user",
          type: "clone",
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailUserComponent,
        data: {
          title: "code_10488",
          breadcrumb: "code_10485/code_10488",
          breadcrumbURLs: ["/AccountManagements/user"],
          service: "user",
          type: "detail",
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateUserComponent,
        data: {
          title: "code_18474",
          breadcrumb: "code_10485/code_18474",
          breadcrumbURLs: ["/AccountManagements/user"],
          service: "user",
          type: "translate",
        },
        resolve: {
          dataR: UserResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_10520",
      type: "user",
      breadcrumb: "code_10520",
      breadcrumbURLs: [""],
      module: "AccountManagement",
    },
  },
  {
    path: "group",
    children: [
      {
        path: "",
        component: ListGroupComponent,
        data: {
          title: "code_4003",
          breadcrumb: "code_4003",
          breadcrumbURLs: [],
          service: "group",
          type: "list",
        },
        resolve: {
          dataR: GroupResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddGroupComponent,
        data: {
          title: "code_10657",
          breadcrumb: "code_4003/code_10657",
          breadcrumbURLs: ["/AccountManagements/group"],
          service: "group",
          type: "add",
        },
        resolve: {
          dataR: GroupResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddGroupComponent,
        data: {
          title: "code_10658",
          breadcrumb: "code_4003/code_10658",
          breadcrumbURLs: ["/AccountManagements/group"],
          service: "group",
          type: "edit",
        },
        resolve: {
          dataR: GroupResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "clone/:id",
        component: CloneGroupComponent,
        data: {
          title: "code_10660",
          breadcrumb: "code_4003/code_10660",
          breadcrumbURLs: ["/AccountManagements/group"],
          service: "group",
          type: "clone",
        },
        resolve: {
          dataR: GroupResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailGroupComponent,
        data: {
          title: "code_10659",
          breadcrumb: "code_4003/code_10659",
          breadcrumbURLs: ["/AccountManagements/group"],
          service: "group",
          type: "detail",
        },
        resolve: {
          dataR: GroupResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateGroupComponent,
        data: {
          title: "code_12358",
          breadcrumb: "code_4003/code_12358",
          breadcrumbURLs: ["/AccountManagements/group"],
          service: "group",
          type: "translate",
        },
        resolve: {
          dataR: GroupResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_581",
      type: "group",
      breadcrumb: "code_581",
      breadcrumbURLs: [""],
      module: "AccountManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountManagementRoutingModule {}
