import { NgModule } from '@angular/core';

import { RequestsServicesRoutingModule } from './requests-services-routing.module';
import { FilterMobileSubscriptionsComponent } from './feature/mobile-subscriptions/filter-mobile-subscriptions/filter-mobile-subscriptions.component';
import { TableMobileSubscriptionsComponent } from './feature/mobile-subscriptions/table-mobile-subscriptions/table-mobile-subscriptions.component';
import { MobileSubscriptionsComponent } from './ui/mobile-subscriptions/mobile-subscriptions.component';
import { MobileSubscriptionsService } from './data-access/mobile-subscriptions/service/mobile-subscription-api.service';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    MobileSubscriptionsComponent, FilterMobileSubscriptionsComponent, TableMobileSubscriptionsComponent,
  ],
  imports: [
    SharedModule,
    RequestsServicesRoutingModule,
    NgSelectModule,
    NgbModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ],
  providers: [MobileSubscriptionsService]
})
export class RequestsServicesModule { }
