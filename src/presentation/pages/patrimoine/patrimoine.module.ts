import { DotationServiceComponent } from './ui/dotation-service/dotation-service.component';
import { GroupeSimComponent } from './ui/groupe-sim/groupe-sim.component';
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

//Components
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { LifecycleSimComponent } from './ui/lifecycle-sim/lifecycle-sim.component';
import { TransactionSimComponent } from './ui/transaction-sim/transaction-sim.component';
import { PatrimoineFormsComponent } from './feature/patrimoine-forms/patrimoine-forms.component';
import { SuspensionFormComponent } from './feature/suspension-form/suspension-form.component';
import { HistoriqueLifecycleComponent } from './feature/historique-lifecycle/historique-lifecycle.component';


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
        CalendarModule
    ],
    declarations: [
        CarteSimActiveComponent,
        GroupeSimComponent,
        DotationServiceComponent,
        LifecycleSimComponent,
        PatrimoineFormsComponent,
        TransactionSimComponent,
        SuspensionFormComponent,
        HistoriqueLifecycleComponent
    ],
})
export class PatrimoineModule { }
