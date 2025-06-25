import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileSubscriptionsComponent } from './ui/mobile-subscriptions/mobile-subscriptions.component';
import { FormDemandComponent } from '../../../shared/components/form-demand/form-demand.component';
import { SimDemandComponent } from '../../../shared/components/sim-demand/sim-demand.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { InvoiceFormComponent } from '../../../shared/components/invoice-form/invoice-form.component';
import { ImportationComponent } from './ui/importation/importation.component';

export const MOBILE_SUBSCRIPTIONS = 'mobile-subscriptions';
export const SIM_IMPORTATION = 'sim-importation';
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
    // {
    //     path: SIM_IMPORTATION,
    //     children: [
    //         {
    //             path: '',
    //             component: ImportationComponent,
    //         },
    //         {
    //             path: FORM,
    //             component: FormDemandComponent,
    //         },
    //         {
    //             path: `${PAYMENT}/:number_demand`,
    //             component: InvoiceFormComponent,
    //         },
    //         {
    //             path: `${INVOICE}/:number_demand`,
    //             component: InvoiceFormComponent,
    //         },
    //         {
    //             path: ':number_demand',
    //             component: SimDemandComponent,
    //         },
    //     ],
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestsServicesRoutingModule {}
