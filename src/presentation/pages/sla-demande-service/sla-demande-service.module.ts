import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';


//Modules Primeng


//Components
import { DashboardSlaComponent } from './ui/dashboard-sla/dashboard-sla.component';
import { RapportConformiteComponent } from './ui/rapport-conformite/rapport-conformite.component';
import { SlaDemandeServiceRoutingModule } from './sla-demande-service-routing.module';
import { RapportTransactionComponent } from './feature/rapport-transaction/rapport-transaction.component';
import { RapportBoxComponent } from './feature/rapport-box/rapport-box.component';

@NgModule({
    imports: [
        SharedModule,
        SlaDemandeServiceRoutingModule,
        NgxPaginationModule,
        NgxCaptchaModule,
    ],
    declarations: [
        DashboardSlaComponent,
        RapportConformiteComponent,
        RapportTransactionComponent,
        RapportBoxComponent,
    ],
})
export class SlaDemandeServiceModule { }
