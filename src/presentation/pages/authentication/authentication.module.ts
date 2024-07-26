import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './ui/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PasswordModule } from 'primeng/password';
import { SharedModule } from 'src/shared/shared.module';
import { AuthenticationService } from './data-access/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthenticationRoutingModule,
    NgxCaptchaModule,
    PasswordModule,
    SharedModule
  ],
  declarations: [
    LoginComponent  
  ],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
