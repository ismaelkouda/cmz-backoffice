import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';
import { AnalyseRejetComponent } from './ui/analyse-rejet/analyse-rejet.component';
import { DetectionApproComponent } from './ui/detection-appro/detection-appro.component';
import { DetectionApproSmsComponent } from './ui/detection-appro-sms/detection-appro-sms.component';
import { AnalysisSmsAlarmsComponent } from './ui/analysis-sms-alarms/analysis-sms-alarms.component';

export const COURBE_MESSAGE_DATA = 'analyse-alarmes-data';
export const COURBE_MESSAGE_SMS = 'analyse-alarmes-sms';
export const DETECTION_APPRO_DATA = 'detection-appro-data';
export const DETECTION_APPRO_SMS = 'detection-appro-sms';
export const ANALAYSE_REJET = 'analyse-rejet';
export const PERFORMANCE_COLLECTE = 'approvisionnement';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: COURBE_MESSAGE_DATA,
                component: CourbeMessageComponent,
            },
            {
                path: COURBE_MESSAGE_SMS,
                component: AnalysisSmsAlarmsComponent,
            },
            {
                path: DETECTION_APPRO_DATA,
                component: DetectionApproComponent,
            },
            {
                path: DETECTION_APPRO_SMS,
                component: DetectionApproSmsComponent,
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
