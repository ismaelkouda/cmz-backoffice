import { DashboardDemandsComponent } from './ui/dashboard-demands/dashboard-demands.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportConformiteComponent } from './ui/rapport-conformite/rapport-conformite.component';
import { DashboardDossiersComponent } from './ui/dashboard-dossiers/dashboard-dossiers.component';

export const DEMANDS_DASHBORD = 'dashboard-demands';
export const FOLDERS_DASHBORD = 'dashboard-folders';
export const RAPPORT_CONFORMITE = 'rapport-performances';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: DEMANDS_DASHBORD,
                component: DashboardDemandsComponent,
            },
            {
                path: FOLDERS_DASHBORD,
                component: DashboardDossiersComponent,
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
