import { SupervisionSystemeRoutingModule } from './supervision-systeme-routing.module';
import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TableModule } from 'primeng/table';
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
import { EtatsServicesComponent } from './ui/etats-services/etats-services.component';
import { TauxDesChargesComponent } from './ui/taux-des-charges/taux-des-charges.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
    declarations: [
        EtatsServicesComponent,
        TauxDesChargesComponent
    ],
    imports: [
        CommonModule,
        SupervisionSystemeRoutingModule,
        TableModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        SharedModule,
        AngularMultiSelectModule,
        NgxPaginationModule,
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
    ]
})
export class SupervisionSystemeModule { }
