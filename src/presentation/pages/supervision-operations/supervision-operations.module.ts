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
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
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
import { SupervisionOperationsRoutingModule } from './supervision-operations-routing.module';
import { SupervisionOperationService } from './data-access/supervision-operation.service';
import { SharedModule } from 'src/shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';


//Components
import { PriseEnChargeComponent } from './ui/prise-en-charge/prise-en-charge.component';
import { AlarmesComponent } from './ui/alarmes/alarmes.component';
import { SuivieTraitementComponent } from './ui/suivie-traitement/suivie-traitement.component';
import { PerformancesComponent } from './ui/performances/performances.component';
import { MessagerieComponent } from './ui/messagerie/messagerie.component';

@NgModule({
    imports: [
        CommonModule,
        SupervisionOperationsRoutingModule,
        TableModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        SharedModule,
        AngularMultiSelectModule,
        Ng2SearchPipeModule,
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
        NgxPaginationModule
    ],
    declarations: [
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
        MessageFormComponent
    ],
    providers: [EditableRow, SupervisionOperationService]
})
export class SupervisionOperationsModule { }

