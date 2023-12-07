import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { SuivieTraitementComponent } from './ui/suivie-traitement/suivie-traitement.component';
import { AlarmesComponent } from './ui/alarmes/alarmes.component';
import { PerformancesComponent } from './ui/performances/performances.component';
import { PriseEnChargeComponent } from './ui/prise-en-charge/prise-en-charge.component';
import { ContencieuxComponent } from './ui/contencieux/contencieux.component';


export const SUPERSION_STATUTS = 'demandes'
export const SUPERSION_PRISE_EN_CHARGE = 'prise-en-charge'
export const SUPERVISION_SUIVIE_TRAITEMENT = 'suivie-et-traitements'
export const PERFORMANCE_SLA = 'performances-sla'
export const CONTENCIEUX = 'contencieux'


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: SUPERSION_STATUTS,
                component: AlarmesComponent,
            },
            {
                path: SUPERVISION_SUIVIE_TRAITEMENT,
                component: SuivieTraitementComponent,
            },
            {
                path: SUPERSION_PRISE_EN_CHARGE,
                component: PriseEnChargeComponent,
            },
            {
                path: PERFORMANCE_SLA,
                component: PerformancesComponent,
            },
            {
                path: CONTENCIEUX,
                component: ContencieuxComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SupervisionOperationsRoutingModule { }
