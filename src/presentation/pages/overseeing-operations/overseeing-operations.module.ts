import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';

import { ClaimsApiService } from './data-access/claims/services/claims-api.service';
import { TreatmentMonitoringApiService } from './data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { WaitingQueueApiService } from './data-access/waiting-queue/services/waiting-queue-api.service';
import { FilterClaimsComponent } from './feature/claims/filter-claims/filter-claims.component';
import { FormClaimsComponent } from './feature/claims/form-claims/form-claims.component';
import { TableClaimsComponent } from './feature/claims/table-claims/table-claims.component';
import { FilterNotificationsCenterComponent } from './feature/notifications-center/filter-notifications-center/filter-notifications-center.component';
import { TableNotificationsCenterComponent } from './feature/notifications-center/table-notifications-center/table-notifications-center.component';
import { FilterTreatmentMonitoringComponent } from './feature/treatment-monitoring/filter-treatment-monitoring/filter-treatment-monitoring.component';
import { TableTreatmentMonitoringComponent } from './feature/treatment-monitoring/table-treatment-monitoring/table-treatment-monitoring.component';
import { FilterWaitingQueueComponent } from './feature/waiting-queue/filter-waiting-queue/filter-waiting-queue.component';
import { TableWaitingQueueComponent } from './feature/waiting-queue/table-waiting-queue/table-waiting-queue.component';
import { OverseeingOperationsRoutingModule } from './overseeing-operations-routing.module';
import { ClaimsComponent } from './ui/claims/claims.component';
import { NotificationsCenterComponent } from './ui/notifications-center/notifications-center.component';
import { TreatmentMonitoringComponent } from './ui/treatment-monitoring/treatment-monitoring.component';
import { WaitingQueueComponent } from './ui/waiting-queue/waiting-queue.component';

@NgModule({
    declarations: [
        FilterWaitingQueueComponent,
        TableWaitingQueueComponent,
        WaitingQueueComponent,
        FilterTreatmentMonitoringComponent,
        TableTreatmentMonitoringComponent,
        TreatmentMonitoringComponent,
        FormClaimsComponent,
        FilterClaimsComponent,
        TableClaimsComponent,
        ClaimsComponent,
        FilterNotificationsCenterComponent,
        TableNotificationsCenterComponent,
        NotificationsCenterComponent,
    ],
    imports: [
        SharedModule,
        OverseeingOperationsRoutingModule,
        NgSelectModule,
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
