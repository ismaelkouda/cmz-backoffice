import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from './../../../shared/shared.module';
import { PasswordResetService } from './data-access/password-reset.service';

//Modules Primeng
import { PasswordResetRoutingModule } from './password-reset-routing.module';

//Components

@NgModule({
    imports: [SharedModule, PasswordResetRoutingModule, NgxPaginationModule],
    //declarations: [ForgotPasswordComponent, ResetPasswordComponent],
    providers: [PasswordResetService],
})
export class PasswordResetModule {}
