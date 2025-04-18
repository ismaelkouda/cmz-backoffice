import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';
import { AnalyseRejetComponent } from './ui/analyse-rejet/analyse-rejet.component';
import { DetectionApproComponent } from './ui/detection-appro/detection-appro.component';

export const COURBE_MESSAGE = 'analyse-alarmes';
export const DETECTION_APPRO = 'detection-appro';
export const ANALAYSE_REJET = 'analyse-rejet';
export const PERFORMANCE_COLLECTE = 'approvisionnement';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: COURBE_MESSAGE,
                component: CourbeMessageComponent,
            },
            {
                path: DETECTION_APPRO,
                component: DetectionApproComponent,
            },
            {
                path: PERFORMANCE_COLLECTE,
                component: PerformanceCollecteComponent,
            },
            {
                path: ANALAYSE_REJET,
                component: AnalyseRejetComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AnalyseAlerteRoutingModule {}
