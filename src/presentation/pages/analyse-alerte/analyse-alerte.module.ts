import { DetectionApproComponent } from './ui/detection-appro/detection-appro.component';
import { AnalyseRejetComponent } from './ui/analyse-rejet/analyse-rejet.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyseAlerteRoutingModule } from './analyse-alerte-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';
import { SoldesSimComponent } from './ui/soldes-sim/soldes-sim.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AnalyseAlerteRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [
    CourbeMessageComponent,
    AnalyseRejetComponent,
    DetectionApproComponent,
    PerformanceCollecteComponent,
    SoldesSimComponent
  ]
})
export class AnalyseAlerteModule { }
