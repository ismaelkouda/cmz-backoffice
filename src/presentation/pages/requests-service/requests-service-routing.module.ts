import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormCustomersActivateComponent } from './feature/customers-activate/form-customers-activate/form-customers-activate.component';
import { CustomersActivateComponent } from './ui/customers-activate/customers-activate.component';

export const CUSTOMERS_ACTIVATE = 'mobile-subscriptions';
export const FORM = 'form';
export const PAYMENT = 'payment';
export const INVOICE = 'invoice';

export const routes: Routes = [
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
