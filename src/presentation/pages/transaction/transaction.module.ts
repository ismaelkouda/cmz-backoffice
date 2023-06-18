import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TransactionRoutingModule } from './transaction-routing.module';

//Components
import { SimSwapComponent } from './ui/sim-swap/sim-swap.component';
import { ResiliationSimComponent } from './ui/resiliation-sim/resiliation-sim.component';

@NgModule({
  declarations: [
    ResiliationSimComponent,
    SimSwapComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TransactionRoutingModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    TabViewModule,
    DialogModule,
    TooltipModule,
    NgxPaginationModule,
  ]
})
export class TransactionModule { }
