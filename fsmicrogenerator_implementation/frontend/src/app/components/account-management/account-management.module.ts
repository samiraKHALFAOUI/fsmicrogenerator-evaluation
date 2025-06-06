import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { UserResolver } from "src/app/shared/resolvers/AccountManagement/user.resolver";
import { GroupResolver } from "src/app/shared/resolvers/AccountManagement/group.resolver";

import { AccountManagementRoutingModule } from "./account-management-routing.module";
import { AddUserComponent } from "./gestion-user/add-user/add-user.component";
import { CloneUserComponent } from "./gestion-user/clone-user/clone-user.component";
import { TranslateUserComponent } from "./gestion-user/translate-user/translate-user.component";
import { ListUserComponent } from "./gestion-user/list-user/list-user.component";
import { SubUserComponent } from "./subComponents/sub-user/sub-user.component";
import { DetailUserComponent } from "./gestion-user/detail-user/detail-user.component";
import { AddGroupComponent } from "./gestion-group/add-group/add-group.component";
import { CloneGroupComponent } from "./gestion-group/clone-group/clone-group.component";
import { TranslateGroupComponent } from "./gestion-group/translate-group/translate-group.component";
import { ListGroupComponent } from "./gestion-group/list-group/list-group.component";
import { SubGroupComponent } from "./subComponents/sub-group/sub-group.component";
import { DetailGroupComponent } from "./gestion-group/detail-group/detail-group.component";
import { UpdateMyProfileComponent } from "./gestion-profile/update-my-profile/update-my-profile.component";
import { MyProfileComponent } from "./gestion-profile/my-profile/my-profile.component";

@NgModule({
  declarations: [
    AddUserComponent,
    CloneUserComponent,
    TranslateUserComponent,
    ListUserComponent,
    SubUserComponent,
    DetailUserComponent,
    AddGroupComponent,
    CloneGroupComponent,
    TranslateGroupComponent,
    ListGroupComponent,
    SubGroupComponent,
    DetailGroupComponent,
    UpdateMyProfileComponent,
    MyProfileComponent
  ],
  imports: [SharedModule, AccountManagementRoutingModule],
  exports: [SubUserComponent, SubGroupComponent],
  providers: [UserResolver, GroupResolver],
})
export class AccountManagementModule {}
