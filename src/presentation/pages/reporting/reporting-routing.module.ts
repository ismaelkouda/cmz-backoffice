import { ReportingSlaComponent } from './ui/reporting-sla/reporting-sla.component';
import { ReportingAlarmeComponent } from './ui/reporting-alarme/reporting-alarme.component';
import { ReportingSoldeComponent } from './ui/reporting-solde/reporting-solde.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const REPORTING_SOLDE = 'soldes';
export const REPORTING_ALARME = 'alarmes';
export const REPORTING_SLA = 'sla';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: REPORTING_SOLDE,
                component: ReportingSoldeComponent,
            },
            {
                path: REPORTING_ALARME,
                component: ReportingAlarmeComponent,
            },
            {
                path: REPORTING_SLA,
                component: ReportingSlaComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportingRoutingModule {}
