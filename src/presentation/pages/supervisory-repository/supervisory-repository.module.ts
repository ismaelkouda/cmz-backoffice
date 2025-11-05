import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../../../shared/shared.module';
import { SlaAgreementsApiService } from './data-access/sla-agreements/services/sla-agreements-api.service';
import { SlaContactsApiService } from './data-access/sla-contacts/services/sla-contacts-api.service';
import { SupervisoryRepositoryRoutingModule } from './supervisory-repository-routing.module';

@NgModule({
    declarations: [
        //TableSlaAgreementsComponent,
        //SlaAgreementsComponent,
        //SlaContactsComponent,
        //FormSlaContactsComponent,
    ],
    imports: [
        SharedModule,
        SupervisoryRepositoryRoutingModule,
        NgbModule,
        NgxPaginationModule,
    ],
    providers: [SlaAgreementsApiService, SlaContactsApiService],
})
export class SupervisoryRepositoryModule {}
