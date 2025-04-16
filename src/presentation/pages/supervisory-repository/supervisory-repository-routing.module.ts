import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorsAlarmsComponent } from './ui/indicators-alarms/indicators-alarms.component';
import { SlaAgreementsComponent } from './ui/sla-agreements/sla-agreements.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';

export const INDICATORS_ALARMS = 'indicators-alarms';
export const SLA_AGREEMENTS = 'sla-agreements';

const routes: Routes = [
  {
    path: INDICATORS_ALARMS,
    children: [
      {
        path: '',
        component: IndicatorsAlarmsComponent
      },
      {
        path: '**',
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${INDICATORS_ALARMS}`]
    }
  },
  {
    path: SLA_AGREEMENTS,
    children: [
      {
        path: '',
        component: SlaAgreementsComponent
      },
      {
        path: '**',
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${SLA_AGREEMENTS}`]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisoryRepositoryRoutingModule { }
