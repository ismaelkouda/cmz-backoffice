import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';
import { OperationSimRoutingModule } from './operation-sim-routing.module';


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
import { OperationFormsComponent } from './ui/operation-forms/operation-forms.component';


@NgModule({
  imports: [
    CommonModule,
    OperationSimRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
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
    NgxCaptchaModule
  ],
  declarations: [
    OperationFormsComponent
  ]
})
export class OperationSimModule { }
