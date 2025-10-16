import { NgModule } from '@angular/core';

import { RequestsServiceRoutingModule } from './requests-service-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableCustomersActivateComponent } from './feature/customers-activate/table-customers-activate/table-customers-activate.component';
import { CustomersActivateComponent } from './ui/customers-activate/customers-activate.component';
import { FormCustomersActivateComponent } from './feature/customers-activate/form-customers-activate/form-customers-activate.component';
import { FilterCustomersActivateComponent } from './feature/customers-activate/filter-customers-activate/filter-customers-activate.component';
import { RequestsServiceApiService } from './data-access/requests-service/services/requests-service-api.service';

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
        AngularMultiSelectModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    providers: [RequestsServiceApiService],
})
export class RequestsServiceModule {}
