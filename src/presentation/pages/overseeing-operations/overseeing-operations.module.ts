import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';

import { ClaimsApiService } from './data-access/claims/services/claims-api.service';
import { TreatmentMonitoringApiService } from './data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { WaitingQueueApiService } from './data-access/waiting-queue/services/waiting-queue-api.service';
import { OverseeingOperationsRoutingModule } from './overseeing-operations-routing.module';

@NgModule({
    declarations: [
        //FilterWaitingQueueComponent,
        //TableWaitingQueueComponent,
        //WaitingQueueComponent,
        //FilterTreatmentMonitoringComponent,
        //TableTreatmentMonitoringComponent,
        //TreatmentMonitoringComponent,
        //FormClaimsComponent,
        //FilterClaimsComponent,
        //TableClaimsComponent,
        //ClaimsComponent,
        //FilterNotificationsCenterComponent,
        //TableNotificationsCenterComponent,
        //NotificationsCenterComponent,
    ],
    imports: [
        SharedModule,
        OverseeingOperationsRoutingModule,
        NgbModule,
        NgxPaginationModule,
    ],
    providers: [
        WaitingQueueApiService,
        TreatmentMonitoringApiService,
        ClaimsApiService,
    ],
})
export class OverseeingOperationsModule {}
