import { SeuilAlarmesComponent } from './ui/seuil-alarmes/seuil-alarmes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilSupervisionComponent } from './ui/profil-supervision/profil-supervision.component';
import { ObjectifSlaComponent } from './ui/objectif-sla/objectif-sla.component';

export const SEUIL_ALARMES = 'metriques-alarmes';
export const OBJECTIFS_SLA = 'objectifs-sla';
export const PROFIL_SUPERVISION = 'profil-supervision';


const routes: Routes = [{
    path: "",
    children: [
        {
            path: SEUIL_ALARMES,
            component: SeuilAlarmesComponent
        },
        {
            path: OBJECTIFS_SLA,
            component: ObjectifSlaComponent
        },
        {
            path: PROFIL_SUPERVISION,
            component: ProfilSupervisionComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RefTelemetrieRoutingModule { }
