import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimCardComponent } from './ui/sim-card/sim-card.component';
import { FormSimCardComponent } from './feature/sim-card/form-sim-card/form-sim-card.component';
import { SmsBalanceStatusComponent } from './ui/sms-balance-status/sms-balance-status.component';
import { DataBalanceStatusComponent } from './ui/data-balance-status/data-balance-status.component';
import { DownloadComponent } from './ui/download/download.component';
import { WhiteSimCardComponent } from './ui/white-sim-card/white-sim-card.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { SimDemandComponent } from '../../../shared/components/sim-demand/sim-demand.component';
import { WhiteSimCardDetailsComponent } from './feature/white-sim-card/details-white-sim-card/white-sim-card-details.component';
import { SIM_IMPORTATION } from '../requests-services/requests-services-routing.module';
import { ImportationComponent } from '../requests-services/ui/importation/importation.component';
import { FORM } from '../demandes-produits/demandes-produits-routing.module';
import { FormDemandComponent } from '../../../shared/components/form-demand/form-demand.component';
import { DetailsImportationComponent } from '../requests-services/feature/importation/details-importation/details-importation.component';

export const SIM_CARD = 'sim-card';
export const SMS_BALANCE_STATUS = 'sms-balance-status';
export const DATA_BALANCE_STATUS = 'data-balance-status';
export const DOWNLOAD = 'download';
export const WHITE_SIM_CARD = 'white-sim-card';

const routes: Routes = [
    {
        path: SIM_CARD,
        children: [
            {
                path: '',
                component: SimCardComponent,
            },
            {
                path: ':imsi',
                component: FormSimCardComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${SIM_CARD}`],
        // },
    },
    {
        path: WHITE_SIM_CARD,
        children: [
            {
                path: '',
                component: WhiteSimCardComponent,
            },
            // {
            //   path: ":number_demand",
            //   component: SimDemandComponent,
            // },
            {
                path: ':id',
                component: WhiteSimCardDetailsComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${WHITE_SIM_CARD}`],
        // },
    },
    {
        path: DATA_BALANCE_STATUS,
        children: [
            {
                path: '',
                component: DataBalanceStatusComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${DATA_BALANCE_STATUS}`],
        // },
    },
    {
        path: SMS_BALANCE_STATUS,
        children: [
            {
                path: '',
                component: SmsBalanceStatusComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${SMS_BALANCE_STATUS}`],
        // },
    },
    {
        path: DOWNLOAD,
        children: [
            {
                path: '',
                component: DownloadComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${DOWNLOAD}`],
        // },
    },
    {
        path: SIM_IMPORTATION,
        children: [
            {
                path: '',
                component: ImportationComponent,
            },
            {
                path: FORM,
                component: FormDemandComponent,
            },
            {
                path: ':number_demand',
                component: DetailsImportationComponent,
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
export class PatrimonyRoutingModule {}
