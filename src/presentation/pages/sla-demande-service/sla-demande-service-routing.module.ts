import { DashboardSlaComponent } from './ui/dashboard-sla/dashboard-sla.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportConformiteComponent } from './ui/rapport-conformite/rapport-conformite.component';

export const SLA_DASHBORD = 'dashboard-sla';
export const RAPPORT_CONFORMITE = 'rapport-performances';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: SLA_DASHBORD,
                component: DashboardSlaComponent,
            },
            {
                path: RAPPORT_CONFORMITE,
                component: RapportConformiteComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SlaDemandeServiceRoutingModule {}
