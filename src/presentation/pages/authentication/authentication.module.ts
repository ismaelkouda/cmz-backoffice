import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './ui/login/login.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from 'src/shared/shared.module';
import { AuthenticationService } from './data-access/authentication.service';

@NgModule({
    imports: [SharedModule, AuthenticationRoutingModule, NgxCaptchaModule],
    declarations: [LoginComponent],
    providers: [AuthenticationService],
})
export class AuthenticationModule {}
