import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { AssociationEnterprisesApiService } from './data-access/association-enterprises/services/association-enterprises-api.service';
import { CommercialEnterprisesApiService } from './data-access/commercial-enterprises/services/commercial-enterprises-api.service';
import { CommercialEnterprisesNavigationGuardService } from './data-access/commercial-enterprises/services/commercial-enterprises-navigation-guard.service';
import { CustomersApiService } from './data-access/customers/services/customers-api.service';
import { IndividualsApiService } from './data-access/individuals/services/individuals-api.service';
import { ManagedCustomersApiService } from './data-access/managed-customers/services/managed-customers-api.service';
import { PublicEnterprisesApiService } from './data-access/public-enterprises/services/public-enterprises-api.service';
import { ManagedCustomersRoutingModule } from './managed-customers-routing.module';

@NgModule({
    declarations: [
        //CommercialEnterprisesComponent,
        //FilterCommercialEnterprisesComponent,
        //TableCommercialEnterprisesComponent,
        //PublicEnterprisesComponent,
        //FilterPublicEnterprisesComponent,
        //TablePublicEnterprisesComponent,
        //AssociationEnterprisesComponent,
        //FilterAssociationEnterprisesComponent,
        //TableAssociationEnterprisesComponent,
        //IndividualsComponent,
        //FilterIndividualsComponent,
        //TableIndividualsComponent,
        //CustomersComponent,
        //FilterCustomersComponent,
        //TableCustomersComponent,
        //DetailsManagedCustomersComponent,
        //IdentificationManagedCustomersComponent,
    ],
    imports: [
        SharedModule,
        ManagedCustomersRoutingModule,
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
