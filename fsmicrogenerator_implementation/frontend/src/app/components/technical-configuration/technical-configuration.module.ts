import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { LangueSiteResolver } from "src/app/shared/resolvers/TechnicalConfiguration/langue-site.resolver";
import { EnumerationResolver } from "src/app/shared/resolvers/TechnicalConfiguration/enumeration.resolver";
import { TechnicalConfigurationRoutingModule } from "./technical-configuration-routing.module";
import { AddLangueSiteComponent } from "./gestion-langue-site/add-langue-site/add-langue-site.component";
import { TranslateLangueSiteComponent } from "./gestion-langue-site/translate-langue-site/translate-langue-site.component";
import { ListLangueSiteComponent } from "./gestion-langue-site/list-langue-site/list-langue-site.component";
import { SubLangueSiteComponent } from "./subComponents/sub-langue-site/sub-langue-site.component";
import { DetailLangueSiteComponent } from "./gestion-langue-site/detail-langue-site/detail-langue-site.component";
import { AddEnumerationComponent } from "./gestion-enumeration/add-enumeration/add-enumeration.component";
import { TranslateEnumerationComponent } from "./gestion-enumeration/translate-enumeration/translate-enumeration.component";
import { ListEnumerationComponent } from "./gestion-enumeration/list-enumeration/list-enumeration.component";
import { SubEnumerationComponent } from "./subComponents/sub-enumeration/sub-enumeration.component";
import { DetailEnumerationComponent } from "./gestion-enumeration/detail-enumeration/detail-enumeration.component";
import { AddMenuComponent } from "./gestion-menu/add-menu/add-menu.component";
import { DetailMenuComponent } from "./gestion-menu/detail-menu/detail-menu.component";
import { ListMenuComponent } from "./gestion-menu/list-menu/list-menu.component";
import { TranslateMenuComponent } from "./gestion-menu/translate-menu/translate-menu.component";
import { SubMenuComponent } from "./subComponents/sub-menu/sub-menu.component";
import { MenuResolver } from "src/app/shared/resolvers/TechnicalConfiguration/menu.resolver";
import { TranslateMultipleEnumerationComponent } from "./gestion-enumeration/translate-multiple-enumeration/translate-multiple-enumeration.component";


@NgModule({
  declarations: [
    AddLangueSiteComponent,
    TranslateLangueSiteComponent,
    ListLangueSiteComponent,
    SubLangueSiteComponent,
    DetailLangueSiteComponent,
    AddEnumerationComponent,
    TranslateEnumerationComponent,
    TranslateMultipleEnumerationComponent,
    ListEnumerationComponent,
    SubEnumerationComponent,
    DetailEnumerationComponent,
    AddMenuComponent,
    TranslateMenuComponent,
    ListMenuComponent,
    SubMenuComponent,
    DetailMenuComponent,
  ],
  imports: [SharedModule, TechnicalConfigurationRoutingModule],
  exports: [
    SubLangueSiteComponent,
    SubEnumerationComponent,
    SubMenuComponent
  ],
  providers: [
    LangueSiteResolver,
    EnumerationResolver,
    MenuResolver,
  ],
})
export class TechnicalConfigurationModule { }
