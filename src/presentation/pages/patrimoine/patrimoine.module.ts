import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatrimoineRoutingModule } from './patrimoine-routing.module';
import { SharedModule } from 'src/shared/shared.module';
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
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { TransactionSimComponent } from './ui/transaction-sim/transaction-sim.component';
import { TransactionFormComponent } from './feature/transaction-form/transaction-form.component';
import { DotationServiceComponent } from './ui/dotation-service/dotation-service.component';
import { GroupeSimComponent } from './ui/groupe-sim/groupe-sim.component';
import { PatrimoineFormsComponent } from './feature/patrimoine-forms/patrimoine-forms.component';
import { DotationFormComponent } from './feature/dotation-form/dotation-form.component';
import { GroupeFormComponent } from './feature/groupe-form/groupe-form.component';
import { CarteMapComponent } from './feature/carte-map/carte-map.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        PatrimoineRoutingModule,
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
        CarteSimActiveComponent,
        GroupeSimComponent,
        DotationServiceComponent,
        PatrimoineFormsComponent,
        TransactionSimComponent,
        TransactionFormComponent,
        DotationFormComponent,
        GroupeFormComponent,
        CarteMapComponent
    ],
})
export class PatrimoineModule { }
