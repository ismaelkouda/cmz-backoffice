import { NgModule } from '@angular/core';
import { SharedModule } from 'src/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';
import { OperationSimRoutingModule } from './operation-sim-routing.module';

//Modules Primeng

//Components
import { OperationFormsComponent } from './ui/operation-forms/operation-forms.component';

@NgModule({
    imports: [
        OperationSimRoutingModule,
        SharedModule,
        NgxPaginationModule,
        NgxCaptchaModule,
    ],
    declarations: [OperationFormsComponent],
})
export class OperationSimModule {}
