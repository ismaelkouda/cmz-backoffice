import { ContactFormComponent } from './features/contact-form/contact-form.component';
import { ContactSlaComponent } from './ui/contact-sla/contact-sla.component';
// import { ObjectifSlaComponent } from './ui/objectif-sla/objectif-sla.component';
import { VisualisationComponent } from './features/visualisation/visualisation.component';
import { AffectationSimComponent } from './features/affectation-sim/affectation-sim.component';
import { NgModule } from '@angular/core';
import { RefTelemetrieRoutingModule } from './ref-telemetrie-routing.module';
import { SharedModule } from './../../../shared/shared.module';

//Components
import { FormsProfilComponent } from './features/forms-profil/forms-profil.component';
import { ProfilSupervisionComponent } from './ui/profil-supervision/profil-supervision.component';
// import { SeuilAlarmesComponent } from './ui/seuil-alarmes/seuil-alarmes.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { IndicatorsAlarmsComponent } from '../supervisory-repository/ui/indicators-alarms/indicators-alarms.component';
import { TableIndicatorsAlarmsComponent } from '../supervisory-repository/feature/indicators-alarms/table-indicators-alarms/table-indicators-alarms.component';
import { IndicatorsAlarmsApiService } from '../supervisory-repository/data-access/indicators-alarms/services/indicators-alarms-api.service';
import { SlaAgreementsApiService } from '../supervisory-repository/data-access/sla-agreements/services/sla-agreements-api.service';
import { TableSlaAgreementsComponent } from '../supervisory-repository/feature/sla-agreements/table-sla-agreements/table-sla-agreements.component';
import { SlaAgreementsComponent } from '../supervisory-repository/ui/sla-agreements/sla-agreements.component';



@NgModule({
  imports: [
    SharedModule,
    RefTelemetrieRoutingModule,
    NgxPaginationModule,

  ],
  declarations: [
    // SeuilAlarmesComponent,
    TableIndicatorsAlarmsComponent,
    IndicatorsAlarmsComponent,
    // ObjectifSlaComponent,
    TableSlaAgreementsComponent,
    SlaAgreementsComponent,
    ProfilSupervisionComponent,
    ContactSlaComponent,
    ContactFormComponent,
    FormsProfilComponent,
    AffectationSimComponent,
    VisualisationComponent
  ],
    providers: [IndicatorsAlarmsApiService, SlaAgreementsApiService]
})
export class RefTelemetrieModule { }
