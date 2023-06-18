import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatrimoineRoutingModule } from './patrimoine-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


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

//Components
import { PatrimoineFormsComponent } from './feature/patrimoine-forms/patrimoine-forms.component';
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { SuspensionFormComponent } from './feature/suspension-form/suspension-form.component';
import { TransactionSimComponent } from './ui/transaction-sim/transaction-sim.component';


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
        RadioButtonModule
    ],
    declarations: [
        CarteSimActiveComponent,
        PatrimoineFormsComponent,
        TransactionSimComponent,
        SuspensionFormComponent
    ],
})
export class PatrimoineModule { }
