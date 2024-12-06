import { FormIdentificationComponent } from './feature/form-identification/form-identification.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../../../shared/shared.module';
import { GestionIdentificationsRoutingModule } from './gestion-identifications-routing.module';
import { GestionIdentificationsService } from './data-access/gestion-identifications.service';
import { StateFileAttenteService } from './data-access/file-attente/state-file-attente.service';
import { FileAttenteComponent } from './ui/file-attente/file-attente.component'
import { FilterFileAttenteComponent } from './feature/file-attente/filter-file-attente/filter-file-attente.component';
import { TableFileAttenteComponent } from './feature/file-attente/table-file-attente/table-file-attente.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatorModule } from 'primeng/paginator';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from 'primeng/fieldset';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [
        FileAttenteComponent, FilterFileAttenteComponent, TableFileAttenteComponent,
        FormIdentificationComponent
    ],
    imports: [
        CommonModule,
        GestionIdentificationsRoutingModule,
        SharedModule,
        NgbModule,
        ReactiveFormsModule,
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
        NgxPaginationModule,
        RadioButtonModule,
        TableModule
    ],
    providers: [
        GestionIdentificationsService,
        StateFileAttenteService,
    ]
})

export class GestionIdentificationsModule {}