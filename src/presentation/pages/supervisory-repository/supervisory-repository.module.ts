import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { SupervisoryRepositoryRoutingModule } from './supervisory-repository-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SlaAgreementsApiService } from './data-access/sla-agreements/services/sla-agreements-api.service';
import { SlaAgreementsComponent } from './ui/sla-agreements/sla-agreements.component';
import { TableSlaAgreementsComponent } from './feature/sla-agreements/table-sla-agreements/table-sla-agreements.component';
import { SlaContactsApiService } from './data-access/sla-contacts/services/sla-contacts-api.service';
import { SlaContactsComponent } from './ui/sla-contacts/sla-contacts.component';
import { FormSlaContactsComponent } from './feature/sla-contacts/form-sla-contacts/form-sla-contacts.component';

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
        AngularMultiSelectModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    providers: [SlaAgreementsApiService, SlaContactsApiService],
})
export class SupervisoryRepositoryModule {}
