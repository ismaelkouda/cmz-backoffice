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
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MultiSelectModule } from 'primeng/multiselect';

//Components
import { VentesComponent } from './ui/ventes/ventes.component';
import { StockComponent } from './ui/stock/stock.component';
import { ProductsComponent } from './ui/products/products.component';
import { AchatsComponent } from './ui/achats/achats.component';
import { GroupesComponent } from './ui/clients/groupes/groupes.component';
import { HistoriqueActivationComponent } from './ui/clients/historique-activation/historique-activation.component';
import { ListClientsComponent } from './ui/clients/list-clients/list-clients.component';
import { ClientFormComponent } from './features/client-form/client-form.component';
import { PointVentesComponent } from './ui/clients/point-ventes/point-ventes.component';
import { VenteFormComponent } from './features/vente-form/vente-form.component';
import { AffectationMembreComponent } from './features/affectation-membre/affectation-membre.component';

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
        CalendarModule,
        RadioButtonModule,
        NgxCaptchaModule,
        MultiSelectModule
    ],
    declarations: [
        VentesComponent,
        StockComponent,
        ProductsComponent,
        AchatsComponent,
        VenteFormComponent,
        ListClientsComponent,
        HistoriqueActivationComponent,
        GroupesComponent,
        PointVentesComponent,
        ClientFormComponent,
        AffectationMembreComponent
    ]
})
export class AdministrationModule { }
