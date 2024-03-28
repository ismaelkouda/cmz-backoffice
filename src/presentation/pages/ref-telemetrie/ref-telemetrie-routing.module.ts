import { SeuilAlarmesComponent } from './ui/seuil-alarmes/seuil-alarmes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilSupervisionComponent } from './ui/profil-supervision/profil-supervision.component';
import { ObjectifSlaComponent } from './ui/objectif-sla/objectif-sla.component';
import { ContactSlaComponent } from './ui/contact-sla/contact-sla.component';

export const SEUIL_ALARMES = 'indicateurs-alarmes';
export const PROFIL_SUPERVISION = 'profil-supervision';
export const OBJECTIFS_SLA = 'accords-sla';
export const CONTACT_SLA = 'contact-sla';

const routes: Routes = [{
    path: "",
    children: [
        {
            path: SEUIL_ALARMES,
            component: SeuilAlarmesComponent
        },
        {
            path: PROFIL_SUPERVISION,
            component: ProfilSupervisionComponent
        },
        {
            path: OBJECTIFS_SLA,
            component: ObjectifSlaComponent
        },
        {
            path: CONTACT_SLA,
            component: ContactSlaComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RefTelemetrieRoutingModule { }
