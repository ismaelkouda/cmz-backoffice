import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { RequestsServiceApiService } from './data-access/requests-service/services/requests-service-api.service';
import { RequestsServiceRoutingModule } from './requests-service-routing.module';

@NgModule({
    declarations: [
        //CustomersActivateComponent,
        //FilterCustomersActivateComponent,
        //TableCustomersActivateComponent,
        //FormCustomersActivateComponent,
    ],
    imports: [
        SharedModule,
        RequestsServiceRoutingModule,
        NgbModule,
        NgxPaginationModule,
    ],
    providers: [RequestsServiceApiService],
})
export class RequestsServiceModule {}
