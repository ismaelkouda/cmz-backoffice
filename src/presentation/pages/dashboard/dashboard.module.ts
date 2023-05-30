import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard.component';
import { StatisticsBoxComponent } from './statistics-box/statistics-box.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    WelcomeComponent,
    StatisticsBoxComponent
  ],
})
export class DashboardModule { }
