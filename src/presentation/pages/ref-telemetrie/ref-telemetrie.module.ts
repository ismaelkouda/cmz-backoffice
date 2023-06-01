import { VisualisationComponent } from './features/visualisation/visualisation.component';
import { AffectationSimComponent } from './features/affectation-sim/affectation-sim.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RefTelemetrieRoutingModule } from './ref-telemetrie-routing.module';
import { SharedModule } from './../../../shared/shared.module';

//Components
import { FormsProfilComponent } from './features/forms-profil/forms-profil.component';
import { ProfilSupervisionComponent } from './ui/profil-supervision/profil-supervision.component';
import { SeuilAlarmesComponent } from './ui/seuil-alarmes/seuil-alarmes.component';

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
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NgxPaginationModule } from 'ngx-pagination';
import { BadgeModule } from 'primeng/badge';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RefTelemetrieRoutingModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    TabViewModule,
    CheckboxModule,
    DialogModule,
    TooltipModule,
    InputSwitchModule,
    NgxPaginationModule,
    BadgeModule
  ],
  declarations: [
    SeuilAlarmesComponent,
    ProfilSupervisionComponent,
    FormsProfilComponent,
    AffectationSimComponent,
    VisualisationComponent
  ]
})
export class RefTelemetrieModule { }
