import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { AssociationEnterprisesApiService } from './data-access/association-enterprises/services/association-enterprises-api.service';
import { CommercialEnterprisesApiService } from './data-access/commercial-enterprises/services/commercial-enterprises-api.service';
import { CommercialEnterprisesNavigationGuardService } from './data-access/commercial-enterprises/services/commercial-enterprises-navigation-guard.service';
import { CustomersApiService } from './data-access/customers/services/customers-api.service';
import { IndividualsApiService } from './data-access/individuals/services/individuals-api.service';
import { ManagedCustomersApiService } from './data-access/managed-customers/services/managed-customers-api.service';
import { PublicEnterprisesApiService } from './data-access/public-enterprises/services/public-enterprises-api.service';
import { FilterAssociationEnterprisesComponent } from './feature/association-enterprises/filter-association-enterprises/filter-association-enterprises.component';
import { TableAssociationEnterprisesComponent } from './feature/association-enterprises/table-association-enterprises/table-association-enterprises.component';
import { FilterCommercialEnterprisesComponent } from './feature/commercial-enterprises/filter-commercial-enterprises/filter-commercial-enterprises.component';
import { TableCommercialEnterprisesComponent } from './feature/commercial-enterprises/table-commercial-enterprises/table-commercial-enterprises.component';
import { FilterCustomersComponent } from './feature/customers/filter-customers/filter-customers.component';
import { TableCustomersComponent } from './feature/customers/table-customers/table-customers.component';
import { FilterIndividualsComponent } from './feature/individuals/filter-individuals/filter-individuals.component';
import { TableIndividualsComponent } from './feature/individuals/table-individuals/table-individuals.component';
import { DetailsManagedCustomersComponent } from './feature/managed-customers/details-managed-customers/details-managed-customers.component';
import { IdentificationManagedCustomersComponent } from './feature/managed-customers/identification-managed-customers/identification-managed-customers.component';
import { FilterPublicEnterprisesComponent } from './feature/public-enterprises/filter-public-enterprises/filter-public-enterprises.component';
import { TablePublicEnterprisesComponent } from './feature/public-enterprises/table-public-enterprises/table-public-enterprises.component';
import { ManagedCustomersRoutingModule } from './managed-customers-routing.module';
import { AssociationEnterprisesComponent } from './ui/association-enterprises/association-enterprises.component';
import { CommercialEnterprisesComponent } from './ui/commercial-enterprises/commercial-enterprises.component';
import { CustomersComponent } from './ui/customers/customers.component';
import { IndividualsComponent } from './ui/individuals/individuals.component';
import { PublicEnterprisesComponent } from './ui/public-enterprises/public-enterprises.component';

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
