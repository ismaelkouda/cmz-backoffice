import { SitesWrapperComponent } from './feature/sites-wrapper/sites-wrapper.component';
import { CardSecondComponent } from './feature/card-second/card-second.component';
import { CarteComponent } from './feature/carte/carte.component';
import { VueGeographiqueComponent } from './ui/vue-geographique/vue-geographique.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { ZoneTraficRoutingModule } from './zone-trafic-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
    declarations: [
        VueGeographiqueComponent,
        CarteComponent,
        CardSecondComponent,
        SitesWrapperComponent
    ],
    imports: [
        CommonModule,
        ZoneTraficRoutingModule,
        TableModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        SharedModule,
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
        NgxPaginationModule
    ]
})
export class ZoneTraficModule { }
