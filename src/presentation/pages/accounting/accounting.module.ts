import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';


import { FilterInvoiceComponent } from './feature/invoice/filter-invoice/filter-invoice.component';
import { TableInvoiceComponent } from './feature/invoice/table-invoice/table-invoice.component';
import { InvoiceComponent } from './ui/invoice/invoice.component';
import { InvoiceApiService } from './data-access/invoice/service/invoice-api.service';

import { FilterMyAccountComponent } from './feature/my-account/filter-my-account/filter-my-account.component';
import { TableMyAccountComponent } from './feature/my-account/table-my-account/table-my-account.component';
import { MyAccountComponent } from './ui/my-account/my-account.component';
import { MyAccountApiService } from './data-access/my-account/service/my-account-api.service';

import { AccountingRoutingModule } from './accounting-routing.module';
import { FormReloadMyAccountComponent } from './feature/reload-my-account/form-reload-my-account/form-reload-my-account.component';
import { FilterReloadMyAccountComponent } from './feature/reload-my-account/filter-reload-my-account/filter-reload-my-account.component';
import { TableReloadMyAccountComponent } from './feature/reload-my-account/table-my-account/table-reload-my-account.component';
import { ReloadMyAccountComponent } from './ui/reload-my-account/reload-my-account.component';
import { ReloadMyAccountApiService } from './data-access/reload-my-account/service/reload-my-account-api.service';

@NgModule({
  declarations: [
    FilterInvoiceComponent,
    TableInvoiceComponent,
    InvoiceComponent,
    
    FilterMyAccountComponent,
    TableMyAccountComponent,
    MyAccountComponent,
    
    FormReloadMyAccountComponent,
    FilterReloadMyAccountComponent,
    TableReloadMyAccountComponent,
    ReloadMyAccountComponent,
  ],
  imports: [
    SharedModule,
    AccountingRoutingModule,
    NgSelectModule,
    NgbModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ],
  providers: [
    InvoiceApiService,

    MyAccountApiService,

    ReloadMyAccountApiService
  ]
})
export class AccountingModule { }
