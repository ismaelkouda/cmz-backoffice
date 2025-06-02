import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileSubscriptionsComponent } from './ui/mobile-subscriptions/mobile-subscriptions.component';
import { FormDemandComponent } from '../../../shared/components/form-demand/form-demand.component';
import { SimDemandComponent } from '../../../shared/components/sim-demand/sim-demand.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { InvoiceFormComponent } from '../../../shared/components/invoice-form/invoice-form.component';

export const MOBILE_SUBSCRIPTIONS = 'mobile-subscriptions';
export const FORM = 'form';
export const PAYMENT = 'payment';
export const INVOICE = 'invoice';
export const LINES = 'lines';

const routes: Routes = [
    {
        path: MOBILE_SUBSCRIPTIONS,
        children: [
            {
                path: '',
                component: MobileSubscriptionsComponent,
            },
            {
                path: FORM,
                component: FormDemandComponent,
            },
            {
                path: `${PAYMENT}/:number_demand`,
                component: InvoiceFormComponent,
            },
            {
                path: `${INVOICE}/:number_demand`,
                component: InvoiceFormComponent,
            },
            {
                path: ':number_demand',
                component: SimDemandComponent,
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${MOBILE_SUBSCRIPTIONS}`],
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestsServicesRoutingModule {}
