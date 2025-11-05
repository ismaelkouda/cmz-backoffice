import { NgModule } from '@angular/core';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from '../../../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationService } from './data-access/authentication.service';

@NgModule({
    imports: [SharedModule, AuthenticationRoutingModule, NgxCaptchaModule],
    //declarations: [LoginComponent],
    providers: [AuthenticationService],
})
export class AuthenticationModule {}
