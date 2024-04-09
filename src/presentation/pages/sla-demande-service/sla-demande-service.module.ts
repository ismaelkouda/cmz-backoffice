import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';


//Modules Primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';


//Components
import { DashboardSlaComponent } from './ui/dashboard-sla/dashboard-sla.component';
import { RapportConformiteComponent } from './ui/rapport-conformite/rapport-conformite.component';
import { SlaDemandeServiceRoutingModule } from './sla-demande-service-routing.module';
import { RapportTransactionComponent } from './feature/rapport-transaction/rapport-transaction.component';
import { RapportBoxComponent } from './feature/rapport-box/rapport-box.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        SlaDemandeServiceRoutingModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        DialogModule,
        TooltipModule,
        NgxPaginationModule,
        InputMaskModule,
        PasswordModule,
        RadioButtonModule,
        NgxCaptchaModule,
        CalendarModule,
        CheckboxModule
    ],
    declarations: [
        DashboardSlaComponent,
        RapportConformiteComponent,
        RapportTransactionComponent,
        RapportBoxComponent,
    ],
})
export class SlaDemandeServiceModule { }
