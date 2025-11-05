import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardApiService } from './data-access/services/dashboard-api.service';

@NgModule({
    imports: [SharedModule, DashboardRoutingModule],
    declarations: [
        //DashboardComponent
    ],
    providers: [DashboardApiService],
})
export class DashboardModule {}
