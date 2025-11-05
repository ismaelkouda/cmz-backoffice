import { NgModule } from '@angular/core';
import { InvoiceNavigationGuardService } from './data-access/invoice/service/invoice-navigation-guard.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';

import { InvoiceApiService } from './data-access/invoice/service/invoice-api.service';

import { MyAccountApiService } from './data-access/my-account/service/my-account-api.service';

import { AccountingRoutingModule } from './accounting-routing.module';

@NgModule({
    declarations: [
        //FilterInvoiceComponent,
        //TableInvoiceComponent,
        //InvoiceComponent,

        //FilterMyAccountComponent,
       // TableMyAccountComponent,
        //MyAccountComponent,
    ],
    imports: [
        SharedModule,
        AccountingRoutingModule,
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
