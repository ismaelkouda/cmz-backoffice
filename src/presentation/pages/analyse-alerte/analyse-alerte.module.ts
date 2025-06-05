import { AnalysisSmsAlarmsComponent } from './ui/analysis-sms-alarms/analysis-sms-alarms.component';
import { DetectionApproComponent } from './ui/detection-appro/detection-appro.component';
import { AnalyseRejetComponent } from './ui/analyse-rejet/analyse-rejet.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { AnalyseAlerteRoutingModule } from './analyse-alerte-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';
import { SoldesSimComponent } from './ui/soldes-sim/soldes-sim.component';
import { DetectionApproSmsComponent } from './ui/detection-appro-sms/detection-appro-sms.component';

@NgModule({
    imports: [SharedModule, AnalyseAlerteRoutingModule, NgxPaginationModule],
    declarations: [
        CourbeMessageComponent,
        AnalysisSmsAlarmsComponent,
        AnalyseRejetComponent,
        DetectionApproComponent,
        DetectionApproSmsComponent,
        PerformanceCollecteComponent,
        SoldesSimComponent,
    ],
})
export class AnalyseAlerteModule {}
