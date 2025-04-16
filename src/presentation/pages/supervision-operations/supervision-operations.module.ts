import { SuivieTraitementFilterStateService } from './data-access/suivie-traitement-filter-state.service';
import { DemandeMasseComponent } from './feature/demande-masse/demande-masse.component';
import { ShowMessageRecieveComponent } from './feature/show-message-recieve/show-message-recieve.component';
import { ShowMessageSenderComponent } from './feature/show-message-sender/show-message-sender.component';
import { MessageFormComponent } from './feature/message-form/message-form.component';
import { RecipientWrapperComponent } from './feature/recipient-wrapper/recipient-wrapper.component';
import { SenderWrapperComponent } from './feature/sender-wrapper/sender-wrapper.component';
import { MessageBoxComponent } from './feature/message-box/message-box.component';
import { JournalTransactionComponent } from './ui/journal-transaction/journal-transaction.component';
import { ShowNotificationComponent } from './feature/show-notification/show-notification.component';
import { NotificationComponent } from './ui/notification/notification.component';
import { ContentieuxComponent } from './ui/contentieux/contentieux.component';
import { DemandeShowComponent } from './feature/demande-show/demande-show.component';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
<<<<<<< HEAD
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
=======
import { EditableRow, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
>>>>>>> origin/backup_v15
import { SupervisionOperationsRoutingModule } from './supervision-operations-routing.module';
import { SupervisionOperationService } from './data-access/supervision-operation.service';
import { SharedModule } from 'src/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


//Components
import { PriseEnChargeComponent } from './ui/prise-en-charge/prise-en-charge.component';
import { AlarmesComponent } from './ui/alarmes/alarmes.component';
import { SuivieTraitementComponent } from './ui/suivie-traitement/suivie-traitement.component';
import { PerformancesComponent } from './ui/performances/performances.component';
import { MessagerieComponent } from './ui/messagerie/messagerie.component';
import { DetailsSuivieTraitementComponent } from './ui/suivie-traitement/details-suivie-traitement/details-suivie-traitement.component';
// import { FilterWaitingQueueComponent } from '../overseeing-operations/feature/waiting-queue/filter-waiting-queue/filter-waiting-queue.component';
// import { TableWaitingQueueComponent } from '../overseeing-operations/feature/waiting-queue/table-waiting-queue/table-waiting-queue.component';
// import { WaitingQueueComponent } from '../overseeing-operations/ui/waiting-queue/waiting-queue.component';
import { WaitingQueueApiService } from '../overseeing-operations/data-access/waiting-queue/services/waiting-queue-api.service';
// import { FilterTreatmentMonitoringComponent } from '../overseeing-operations/feature/treatment-monitoring/filter-treatment-monitoring/filter-treatment-monitoring.component';
// import { TableTreatmentMonitoringComponent } from '../overseeing-operations/feature/treatment-monitoring/table-treatment-monitoring/table-treatment-monitoring.component';
// import { TreatmentMonitoringComponent } from '../overseeing-operations/ui/treatment-monitoring/treatment-monitoring.component';
import { TreatmentMonitoringApiService } from '../overseeing-operations/data-access/treatment-monitoring/services/treatment-monitoring-api.service';
// import { ClaimsComponent } from '../overseeing-operations/ui/claims/claims.component';
// import { FilterClaimsComponent } from '../overseeing-operations/feature/claims/filter-claims/filter-claims.component';
// import { TableClaimsComponent } from '../overseeing-operations/feature/claims/table-claims/table-claims.component';
import { ClaimsApiService } from '../overseeing-operations/data-access/claims/services/claims-api.service';

@NgModule({
    imports: [
        SharedModule,
<<<<<<< HEAD
        SupervisionOperationsRoutingModule,
        NgSelectModule,
        NgbModule,
        AngularMultiSelectModule,
        Ng2SearchPipeModule,
=======
        InputTextModule,
        ToolbarModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        CalendarModule,
        FieldsetModule,
        TabViewModule,
        MultiSelectModule,
        InputTextareaModule,
        TabViewModule,
        DropdownModule,
        SplitButtonModule,
        TooltipModule,
        CheckboxModule,
        BadgeModule,
        InputSwitchModule,
        RadioButtonModule,
        DynamicDialogModule,
        PaginatorModule,
>>>>>>> origin/backup_v15
        NgxPaginationModule,
    ],
    declarations: [
        // FilterWaitingQueueComponent,
        // TableWaitingQueueComponent,
        // WaitingQueueComponent,

        // FilterTreatmentMonitoringComponent,
        // TableTreatmentMonitoringComponent,
        // TreatmentMonitoringComponent,

        // ClaimsComponent, 
        // FilterClaimsComponent, 
        // TableClaimsComponent,

        SuivieTraitementComponent,
        AlarmesComponent,
        PriseEnChargeComponent,
        PerformancesComponent,
        ContentieuxComponent,
        DemandeShowComponent,
        NotificationComponent,
        ShowNotificationComponent,
        JournalTransactionComponent,
        MessagerieComponent,
        MessageBoxComponent,
        SenderWrapperComponent,
        RecipientWrapperComponent,
        MessageFormComponent,
        ShowMessageSenderComponent,
        ShowMessageRecieveComponent,
        DetailsSuivieTraitementComponent,
        DemandeMasseComponent
    ],
    providers: [
        SupervisionOperationService, 
        SuivieTraitementFilterStateService,
        // WaitingQueueApiService, 
        // TreatmentMonitoringApiService, 
        // ClaimsApiService
    ]
})
export class SupervisionOperationsModule { }

