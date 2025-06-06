import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { DomainResolver } from "src/app/shared/resolvers/TaxonomyManagement/domain.resolver";
import { TaxonomyResolver } from "src/app/shared/resolvers/TaxonomyManagement/taxonomy.resolver";

import { TaxonomyManagementRoutingModule } from "./taxonomy-management-routing.module";
import { AddDomainComponent } from "./domain-management/add-domain/add-domain.component";
import { TranslateDomainComponent } from "./domain-management/translate-domain/translate-domain.component";
import { ListDomainComponent } from "./domain-management/list-domain/list-domain.component";
import { SubDomainComponent } from "./subComponents/sub-domain/sub-domain.component";
import { DetailDomainComponent } from "./domain-management/detail-domain/detail-domain.component";
import { AddTaxonomyComponent } from "./taxonomy-management/add-taxonomy/add-taxonomy.component";
import { TranslateTaxonomyComponent } from "./taxonomy-management/translate-taxonomy/translate-taxonomy.component";
import { ListTaxonomyComponent } from "./taxonomy-management/list-taxonomy/list-taxonomy.component";
import { SubTaxonomyComponent } from "./subComponents/sub-taxonomy/sub-taxonomy.component";
import { DetailTaxonomyComponent } from "./taxonomy-management/detail-taxonomy/detail-taxonomy.component";

@NgModule({
  declarations: [
    AddDomainComponent,
    TranslateDomainComponent,
    ListDomainComponent,
    SubDomainComponent,
    DetailDomainComponent,
    AddTaxonomyComponent,
    TranslateTaxonomyComponent,
    ListTaxonomyComponent,
    SubTaxonomyComponent,
    DetailTaxonomyComponent,
  ],
  imports: [SharedModule, TaxonomyManagementRoutingModule],
  exports: [SubDomainComponent, SubTaxonomyComponent],
  providers: [DomainResolver, TaxonomyResolver],
})
export class TaxonomyManagementModule {}
