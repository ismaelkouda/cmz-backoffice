import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';


//Modules Primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';

//Components
import { AchatsComponent } from './ui/achats/achats.component';
import { ProductsComponent } from './ui/products/products.component';
import { StockComponent } from './ui/stock/stock.component';
import { VentesComponent } from './ui/ventes/ventes.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdministrationRoutingModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        CheckboxModule,
        DialogModule,
        NgxPaginationModule,
        TooltipModule,
        CalendarModule
    ],
    declarations: [
        VentesComponent,
        StockComponent,
        ProductsComponent,
        AchatsComponent
    ]
})
export class AdministrationModule { }
