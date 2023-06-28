import { PriseEnChargeComponent } from './feature/prise-en-charge/prise-en-charge.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuivieTraitementComponent } from './feature/suivie-traitement/suivie-traitement.component';
import { AlarmesComponent } from './feature/alarmes/alarmes.component';
import { PerformancesComponent } from './ui/performances/performances.component';


export const SUPERSION_STATUTS = 'statuts';
export const SUPERSION_PRISE_EN_CHARGE = 'prise-en-charge';
export const SUPERVISION_SUIVIE_TRAITEMENT = 'suivie-et-traitements';
export const PERFORMANCE_SLA = 'performances-sla';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: SUPERSION_STATUTS,
                component: AlarmesComponent,
            },
            {
                path: SUPERSION_PRISE_EN_CHARGE,
                component: PriseEnChargeComponent,
            },
            {
                path: SUPERVISION_SUIVIE_TRAITEMENT,
                component: SuivieTraitementComponent,
            },
            {
                path: PERFORMANCE_SLA,
                component: PerformancesComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SupervisionOperationsRoutingModule { }
