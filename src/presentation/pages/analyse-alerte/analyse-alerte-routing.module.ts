import { SoldesSimComponent } from './ui/soldes-sim/soldes-sim.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';

export const COURBE_MESSAGE = 'analyse-alarmes';
export const PERFORMANCE_COLLECTE = 'approvisionnement';
export const SOLDES_SIM = 'soldes-sim';
export const ETAT_LIAISON = 'etat-des-liaisons';


const routes: Routes = [{
    path: "",
    children: [
        {
            path: PERFORMANCE_COLLECTE,
            component: PerformanceCollecteComponent
        },
        {
            path: COURBE_MESSAGE,
            component: CourbeMessageComponent
        },
        {
            path: SOLDES_SIM,
            component: SoldesSimComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyseAlerteRoutingModule { }
