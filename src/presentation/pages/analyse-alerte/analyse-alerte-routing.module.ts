import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';

export const PERFORMANCE_COLLECTE = 'performance-de-collecte';
export const COURBE_MESSAGE = 'courbes-messages';
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
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyseAlerteRoutingModule { }
