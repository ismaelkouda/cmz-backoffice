import { NgModule } from '@angular/core';

import { PatrimonyRoutingModule } from './patrimony-routing.module';
import { FilterSimCardComponent } from './feature/sim-card/filter-sim-card/filter-sim-card.component';
import { TableSimCardComponent } from './feature/sim-card/table-sim-card/table-sim-card.component';
import { SimCardComponent } from './ui/sim-card/sim-card.component';
import { simCardApiService } from './data-access/sim-card/services/sim-card-api.service';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormSimCardComponent } from './feature/sim-card/form-sim-card/form-sim-card.component';
import { FilterSmsBalanceStatusComponent } from './feature/sms-balance-status/filter-sms-balance-status/filter-sms-balance-status.component';
import { TableSmsBalanceStatusComponent } from './feature/sms-balance-status/table-sms-balance-status/table-sms-balance-status.component';
import { SmsBalanceStatusComponent } from './ui/sms-balance-status/sms-balance-status.component';
import { FilterDataBalanceStatusComponent } from './feature/data-balance-status/filter-data-balance-status/filter-data-balance-status.component';
import { TableDataBalanceStatusComponent } from './feature/data-balance-status/table-data-balance-status/table-data-balance-status.component';
import { DataBalanceStatusComponent } from './ui/data-balance-status/data-balance-status.component';
import { DownloadComponent } from './ui/download/download.component';
import { TableDownloadComponent } from './feature/download/table-download/table-download.component';
import { downloadApiService } from './data-access/download/services/download-api.service';
import { FilterWhiteSimCardComponent } from './feature/white-sim-card/filter-white-sim-card/filter-white-sim-card.component';
import { TableWhiteSimCardComponent } from './feature/white-sim-card/table-white-sim-card/table-white-sim-card.component';
import { WhiteSimCardComponent } from './ui/white-sim-card/white-sim-card.component';
import { whiteSimCardApiService } from './data-access/white-sim-card/services/white-sim-card-api.service';
import { smsBalanceStatusApiService } from './data-access/sms-balance-status/services/sms-balance-status-api.service';
import { dataBalanceStatusApiService } from './data-access/data-balance-status/services/data-balance-status-api.service';


@NgModule({
  declarations: [
    FilterDataBalanceStatusComponent,
    TableDataBalanceStatusComponent,
    DataBalanceStatusComponent,

    FilterSmsBalanceStatusComponent,
    TableSmsBalanceStatusComponent,
    SmsBalanceStatusComponent,

    FormSimCardComponent,
    FilterSimCardComponent,
    TableSimCardComponent,
    SimCardComponent,

    FilterWhiteSimCardComponent,
    TableWhiteSimCardComponent,
    WhiteSimCardComponent,

    DownloadComponent,
    TableDownloadComponent
  ],
  imports: [
    SharedModule,
    PatrimonyRoutingModule,
    NgSelectModule,
    NgbModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ],
  providers: [
    simCardApiService,
    whiteSimCardApiService,
    downloadApiService,
    smsBalanceStatusApiService,
    dataBalanceStatusApiService
  ]
})
export class PatrimonyModule { }
