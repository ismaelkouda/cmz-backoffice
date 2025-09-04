import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersActivateComponent } from './ui/customers-activate/customers-activate.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { InvoiceFormComponent } from '../../../shared/components/invoice-form/invoice-form.component';
import { FormCustomersActivateComponent } from './feature/customers-activate/form-customers-activate/form-customers-activate.component';

export const CUSTOMERS_ACTIVATE = 'mobile-subscriptions';
export const FORM = 'form';
export const PAYMENT = 'payment';
export const INVOICE = 'invoice';

const routes: Routes = [
    {
        path: CUSTOMERS_ACTIVATE,
        children: [
            {
                path: '',
                component: CustomersActivateComponent,
            },
            {
                path: FORM,
                component: FormCustomersActivateComponent,
            },
            {
                path: `${PAYMENT}/:id`,
                component: InvoiceFormComponent,
            },
            {
                path: `${INVOICE}/:id`,
                component: InvoiceFormComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${CUSTOMERS_ACTIVATE}`],
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestsServiceRoutingModule {}
