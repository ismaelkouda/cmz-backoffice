import { PasswordResetService } from './data-access/password-reset.service';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

//Modules Primeng
import { PasswordResetRoutingModule } from './password-reset-routing.module';

//Components
import { ResetPasswordComponent } from './ui/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './ui/forgot-password/forgot-password.component';

@NgModule({
    imports: [SharedModule, PasswordResetRoutingModule, NgxPaginationModule],
    declarations: [ForgotPasswordComponent, ResetPasswordComponent],
    providers: [PasswordResetService],
})
export class PasswordResetModule {}
