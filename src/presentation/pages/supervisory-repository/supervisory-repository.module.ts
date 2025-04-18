import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { SupervisoryRepositoryRoutingModule } from './supervisory-repository-routing.module';
import { TableIndicatorsAlarmsComponent } from './feature/indicators-alarms/table-indicators-alarms/table-indicators-alarms.component';
import { IndicatorsAlarmsComponent } from './ui/indicators-alarms/indicators-alarms.component';
import { IndicatorsAlarmsApiService } from './data-access/indicators-alarms/services/indicators-alarms-api.service';
import { SharedModule } from '../../../shared/shared.module';
import { SlaAgreementsApiService } from './data-access/sla-agreements/services/sla-agreements-api.service';
import { SlaAgreementsComponent } from './ui/sla-agreements/sla-agreements.component';
import { TableSlaAgreementsComponent } from './feature/sla-agreements/table-sla-agreements/table-sla-agreements.component';

@NgModule({
    declarations: [
        TableIndicatorsAlarmsComponent,
        IndicatorsAlarmsComponent,
        TableSlaAgreementsComponent,
        SlaAgreementsComponent,
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
    providers: [IndicatorsAlarmsApiService, SlaAgreementsApiService],
})
export class SupervisoryRepositoryModule {}
