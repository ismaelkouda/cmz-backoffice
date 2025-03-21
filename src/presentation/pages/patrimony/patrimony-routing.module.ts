import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimCardComponent } from './ui/sim-card/sim-card.component';
import { FormSimCardComponent } from './feature/sim-card/form-sim-card/form-sim-card.component';
import { SmsBalanceStatusComponent } from './ui/sms-balance-status/sms-balance-status.component';
import { DataBalanceStatusComponent } from './ui/data-balance-status/data-balance-status.component';
import { DownloadComponent } from './ui/download/download.component';
import { WhiteSimCardComponent } from './ui/white-sim-card/white-sim-card.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';

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
        path: ":imsi",
        component: FormSimCardComponent,
      },
      {
        path: '**',
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${SIM_CARD}`]
    }
  },
  {
    path: WHITE_SIM_CARD,
    children: [
      {
        path: '',
        component: WhiteSimCardComponent,
      },
      {
        path: '**',
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${WHITE_SIM_CARD}`]
    }
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
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${DATA_BALANCE_STATUS}`]
    }
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
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${SMS_BALANCE_STATUS}`]
    }
  },
  {
    path: DOWNLOAD,
    children: [
      {
        path: '',
        component: DownloadComponent
      },
      {
        path: '**',
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${DOWNLOAD}`]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatrimonyRoutingModule { }
