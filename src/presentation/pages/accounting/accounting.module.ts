import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';

import { AccountingRoutingModule } from './overseeing-operations-routing.module';

import { FilterInvoiceComponent } from './feature/invoice/filter-invoice/filter-invoice.component';
import { TableInvoiceComponent } from './feature/invoice/table-invoice/table-invoice.component';
import { InvoiceComponent } from './ui/invoice/invoice.component';
import { InvoiceApiService } from './data-access/invoice/services/invoice-api.service';

@NgModule({
  declarations: [
    FilterInvoiceComponent,
    TableInvoiceComponent,
    InvoiceComponent,
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
  ]
})
export class AccountingModule { }
