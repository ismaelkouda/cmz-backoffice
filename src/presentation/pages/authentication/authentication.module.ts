import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortailComponent } from './portail/portail.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PasswordModule } from 'primeng/password';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthenticationRoutingModule,
    NgxCaptchaModule,
    PasswordModule
  ],
  declarations: [
    LoginComponent,
    PortailComponent
  ],
})
export class AuthenticationModule { }
