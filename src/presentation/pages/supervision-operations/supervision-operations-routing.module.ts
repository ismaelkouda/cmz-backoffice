import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuivieTraitementComponent } from './ui/suivie-traitement/suivie-traitement.component';
import { AlarmesComponent } from './ui/alarmes/alarmes.component';
import { PerformancesComponent } from './ui/performances/performances.component';
import { PriseEnChargeComponent } from './ui/prise-en-charge/prise-en-charge.component';
import { ContencieuxComponent } from './ui/contencieux/contencieux.component';


export const DEMANDE_ROUTE = 'demandes'
export const PRISE_EN_CHARGE_ROUTE = 'prise-en-charge'
export const SUIVIE_TRAITEMENT_ROUTE = 'suivie-et-traitements'
export const PERFORMANCE_SLA_ROUTE = 'performances-sla'
export const CONTENCIEUX_ROUTE = 'contencieux'


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: DEMANDE_ROUTE,
                component: AlarmesComponent,
            },
            {
                path: SUIVIE_TRAITEMENT_ROUTE,
                component: SuivieTraitementComponent,
            },
            {
                path: PRISE_EN_CHARGE_ROUTE,
                component: PriseEnChargeComponent,
            },
            {
                path: PERFORMANCE_SLA_ROUTE,
                component: PerformancesComponent,
            },
            {
                path: CONTENCIEUX_ROUTE,
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
