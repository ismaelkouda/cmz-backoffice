import { DetectionApproComponent } from './ui/detection-appro/detection-appro.component';
import { AnalyseRejetComponent } from './ui/analyse-rejet/analyse-rejet.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//Modules Primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { AnalyseAlerteRoutingModule } from './analyse-alerte-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'primeng/tooltip';

//Components
import { CollecteComponent } from './feature/collecte/collecte.component';
import { PerformanceCollecteComponent } from './ui/performance-collecte/performance-collecte.component';
import { CourbeMessageComponent } from './ui/courbe-message/courbe-message.component';
import { SoldesSimComponent } from './ui/soldes-sim/soldes-sim.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AnalyseAlerteRoutingModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    TabViewModule,
    CheckboxModule,
    DialogModule,
    NgxPaginationModule,
    TooltipModule
  ],
  declarations: [
    CourbeMessageComponent,
    AnalyseRejetComponent,
    DetectionApproComponent,
    PerformanceCollecteComponent,
    SoldesSimComponent,
    CollecteComponent
  ]
})
export class AnalyseAlerteModule { }
