import { SupervisionSystemeRoutingModule } from './supervision-systeme-routing.module';
import { NgModule, } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxPaginationModule } from 'ngx-pagination';
<<<<<<< HEAD
import { Ng2SearchPipeModule } from 'ng2-search-filter';
=======
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
>>>>>>> origin/backup_v15
import { EtatsServicesComponent } from './ui/etats-services/etats-services.component';
import { TauxDesChargesComponent } from './ui/taux-des-charges/taux-des-charges.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
    declarations: [
        EtatsServicesComponent,
        TauxDesChargesComponent
    ],
    imports: [
        SharedModule,
<<<<<<< HEAD
        SupervisionSystemeRoutingModule,
        NgSelectModule,
        NgbModule,
        AngularMultiSelectModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
=======
        NgxPaginationModule,
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
>>>>>>> origin/backup_v15
    ]
})
export class SupervisionSystemeModule { }
