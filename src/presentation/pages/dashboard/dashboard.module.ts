import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    ButtonModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
