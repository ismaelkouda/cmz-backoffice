import { NgModule } from '@angular/core';

import { ManagedCustomersRoutingModule } from './managed-customers-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterCommercialEnterprisesComponent } from './feature/commercial-enterprises/filter-commercial-enterprises/filter-commercial-enterprises.component';
import { TableCommercialEnterprisesComponent } from './feature/commercial-enterprises/table-commercial-enterprises/table-commercial-enterprises.component';
import { CommercialEnterprisesComponent } from './ui/commercial-enterprises/commercial-enterprises.component';
import { CommercialEnterprisesApiService } from './data-access/commercial-enterprises/services/commercial-enterprises-api.service';
import { PublicEnterprisesComponent } from './ui/public-enterprises/public-enterprises.component';
import { FilterPublicEnterprisesComponent } from './feature/public-enterprises/filter-public-enterprises/filter-public-enterprises.component';
import { TablePublicEnterprisesComponent } from './feature/public-enterprises/table-public-enterprises/table-public-enterprises.component';
import { PublicEnterprisesApiService } from './data-access/public-enterprises/services/public-enterprises-api.service';
import { AssociationEnterprisesComponent } from './ui/association-enterprises/association-enterprises.component';
import { FilterAssociationEnterprisesComponent } from './feature/association-enterprises/filter-association-enterprises/filter-association-enterprises.component';
import { TableAssociationEnterprisesComponent } from './feature/association-enterprises/table-association-enterprises/table-association-enterprises.component';
import { AssociationEnterprisesApiService } from './data-access/association-enterprises/services/association-enterprises-api.service';
import { IndividualsComponent } from './ui/individuals/individuals.component';
import { FilterIndividualsComponent } from './feature/individuals/filter-individuals/filter-individuals.component';
import { TableIndividualsComponent } from './feature/individuals/table-individuals/table-individuals.component';
import { IndividualsApiService } from './data-access/individuals/services/individuals-api.service';
import { CustomersComponent } from './ui/customers/customers.component';
import { FilterCustomersComponent } from './feature/customers/filter-customers/filter-customers.component';
import { TableCustomersComponent } from './feature/customers/table-customers/table-customers.component';
import { CustomersApiService } from './data-access/customers/services/customers-api.service';
import { ManagedCustomersApiService } from './data-access/managed-customers/services/managed-customers-api.service';
import { DetailsManagedCustomersComponent } from './feature/managed-customers/details-managed-customers/details-managed-customers.component';
import { IdentificationManagedCustomersComponent } from './feature/managed-customers/identification-managed-customers/identification-managed-customers.component';
import { CommercialEnterprisesNavigationGuardService } from './data-access/commercial-enterprises/services/commercial-enterprises-navigation-guard.service';

@NgModule({
    declarations: [
        CommercialEnterprisesComponent,
        FilterCommercialEnterprisesComponent,
        TableCommercialEnterprisesComponent,
        PublicEnterprisesComponent,
        FilterPublicEnterprisesComponent,
        TablePublicEnterprisesComponent,
        AssociationEnterprisesComponent,
        FilterAssociationEnterprisesComponent,
        TableAssociationEnterprisesComponent,
        IndividualsComponent,
        FilterIndividualsComponent,
        TableIndividualsComponent,
        CustomersComponent,
        FilterCustomersComponent,
        TableCustomersComponent,
        DetailsManagedCustomersComponent,
        IdentificationManagedCustomersComponent,
    ],
    imports: [
        SharedModule,
        ManagedCustomersRoutingModule,
        NgSelectModule,
        NgbModule,
        AngularMultiSelectModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    providers: [
        CommercialEnterprisesApiService,
        CommercialEnterprisesNavigationGuardService,
        PublicEnterprisesApiService,
        AssociationEnterprisesApiService,
        IndividualsApiService,
        CustomersApiService,
        ManagedCustomersApiService,
    ],
})
export class ManagedCustomersModule {}
