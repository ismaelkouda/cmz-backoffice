import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhiteSimComponent } from './ui/white-sim/white-sim.component';
import { FormDemandComponent } from '../../../shared/components/form-demand/form-demand.component';
import { SimDemandComponent } from '../../../shared/components/sim-demand/sim-demand.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { InvoiceFormComponent } from '../../../shared/components/invoice-form/invoice-form.component';

export const WHITE_SIM = 'white-sim';
export const FORM = 'form';
export const PAYMENT = 'payment';
export const INVOICE = 'invoice';
export const LINES = 'lines';

const routes: Routes = [
    {
        path: WHITE_SIM,
        children: [
            {
                path: '',
                component: WhiteSimComponent,
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
        //     allowedPaths: [`/${WHITE_SIM}`],
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestsProductsRoutingModule {}
