import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './ui/invoice/invoice.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { MyAccountComponent } from './ui/my-account/my-account.component';
import { InvoiceFormComponent } from '../../../shared/components/invoice-form/invoice-form.component';
import { ReloadMyAccountComponent } from './ui/reload-my-account/reload-my-account.component';
import { FormReloadMyAccountComponent } from './feature/reload-my-account/form-reload-my-account/form-reload-my-account.component';
import { PaymentComponent } from './ui/payment/payment.component';

export const MY_PAYMENTS = 'my-payments';
export const MY_INVOICES = 'my-invoices';
export const MY_ACCOUNT = 'my-account';
export const MY_RELOADS = 'reload-my-account';
export const FORM = 'form';

const routes: Routes = [
    {
        path: MY_INVOICES,
        children: [
            {
                path: '',
                component: InvoiceComponent,
            },
            {
                path: `:number_demand`,
                component: InvoiceFormComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: MY_PAYMENTS,
        children: [
            {
                path: '',
                component: PaymentComponent,
            },
            {
                path: `:number_demand`,
                component: InvoiceFormComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: MY_ACCOUNT,
        children: [
            {
                path: '',
                component: MyAccountComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: MY_RELOADS,
        children: [
            {
                path: '',
                component: ReloadMyAccountComponent,
            },
            {
                path: ':transaction',
                component: FormReloadMyAccountComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    // {
    //     canActivate: [PagesGuard],
    //     data: {
    //         allowedPaths: [`/${INVOICE}`, `/${MY_ACCOUNT}`],
    //     },
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountingRoutingModule {}
