import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';

import { ReportingRoutingModule } from './reporting-routing.module';
import { SharedModule } from '../../../shared/shared.module';

//Components



@NgModule({
    imports: [
        SharedModule,
        ReportingRoutingModule,
        NgxPaginationModule,
        NgxCaptchaModule,
    ],
    declarations: [
        
    ],
})
export class ReportingModule { }
