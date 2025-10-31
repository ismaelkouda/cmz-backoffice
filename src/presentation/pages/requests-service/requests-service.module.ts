import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { RequestsServiceApiService } from './data-access/requests-service/services/requests-service-api.service';
import { FilterCustomersActivateComponent } from './feature/customers-activate/filter-customers-activate/filter-customers-activate.component';
import { FormCustomersActivateComponent } from './feature/customers-activate/form-customers-activate/form-customers-activate.component';
import { TableCustomersActivateComponent } from './feature/customers-activate/table-customers-activate/table-customers-activate.component';
import { RequestsServiceRoutingModule } from './requests-service-routing.module';
import { CustomersActivateComponent } from './ui/customers-activate/customers-activate.component';

@NgModule({
    declarations: [
        CustomersActivateComponent,
        FilterCustomersActivateComponent,
        TableCustomersActivateComponent,
        FormCustomersActivateComponent,
    ],
    imports: [
        SharedModule,
        RequestsServiceRoutingModule,
        NgSelectModule,
        NgbModule,
        NgxPaginationModule,
    ],
    providers: [RequestsServiceApiService],
})
export class RequestsServiceModule {}
