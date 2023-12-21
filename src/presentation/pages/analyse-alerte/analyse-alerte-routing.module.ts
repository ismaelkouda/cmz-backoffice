import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';
import { AnalyseRejetComponent } from './ui/analyse-rejet/analyse-rejet.component';

export const COURBE_MESSAGE = 'analyse-alarmes';
export const ANALAYSE_REJET = 'analyse-rejet';
export const PERFORMANCE_COLLECTE = 'approvisionnement';
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
            path: ANALAYSE_REJET,
            component: AnalyseRejetComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyseAlerteRoutingModule { }
