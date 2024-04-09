import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PasswordResetRoutingModule } from './password-reset-routing.module';

//Components
import { ResetPasswordComponent } from './ui/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './ui/forgot-password/forgot-password.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PasswordResetRoutingModule,
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
    PasswordModule
  ],
  declarations: [
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
})
export class PasswordResetModule { }
