import { NgModule } from '@angular/core';
import { InvoiceNavigationGuardService } from './data-access/invoice/service/invoice-navigation-guard.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';

import { InvoiceApiService } from './data-access/invoice/service/invoice-api.service';
import { FilterInvoiceComponent } from './feature/invoice/filter-invoice/filter-invoice.component';
import { TableInvoiceComponent } from './feature/invoice/table-invoice/table-invoice.component';
import { InvoiceComponent } from './ui/invoice/invoice.component';

import { MyAccountApiService } from './data-access/my-account/service/my-account-api.service';
import { FilterMyAccountComponent } from './feature/my-account/filter-my-account/filter-my-account.component';
import { TableMyAccountComponent } from './feature/my-account/table-my-account/table-my-account.component';
import { MyAccountComponent } from './ui/my-account/my-account.component';

import { AccountingRoutingModule } from './accounting-routing.module';

@NgModule({
    declarations: [
        FilterInvoiceComponent,
        TableInvoiceComponent,
        InvoiceComponent,

        FilterMyAccountComponent,
        TableMyAccountComponent,
        MyAccountComponent,
    ],
    imports: [
        SharedModule,
        AccountingRoutingModule,
        NgSelectModule,
        NgbModule,
        NgxPaginationModule,
    ],
    providers: [
        InvoiceApiService,
        MyAccountApiService,
        InvoiceNavigationGuardService,
    ],
})
export class AccountingModule {}
