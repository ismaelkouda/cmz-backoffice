import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../../../shared/shared.module';
import { SlaAgreementsApiService } from './data-access/sla-agreements/services/sla-agreements-api.service';
import { SlaContactsApiService } from './data-access/sla-contacts/services/sla-contacts-api.service';
import { TableSlaAgreementsComponent } from './feature/sla-agreements/table-sla-agreements/table-sla-agreements.component';
import { FormSlaContactsComponent } from './feature/sla-contacts/form-sla-contacts/form-sla-contacts.component';
import { SupervisoryRepositoryRoutingModule } from './supervisory-repository-routing.module';
import { SlaAgreementsComponent } from './ui/sla-agreements/sla-agreements.component';
import { SlaContactsComponent } from './ui/sla-contacts/sla-contacts.component';

@NgModule({
    declarations: [
        TableSlaAgreementsComponent,
        SlaAgreementsComponent,
        SlaContactsComponent,
        FormSlaContactsComponent,
    ],
    imports: [
        SharedModule,
        SupervisoryRepositoryRoutingModule,
        NgSelectModule,
        NgbModule,
        NgxPaginationModule,
    ],
    providers: [SlaAgreementsApiService, SlaContactsApiService],
})
export class SupervisoryRepositoryModule {}
