import { CardStockComponent } from './feature/card-stock/card-stock.component';
import { StockProduitComponent } from './ui/stock-produit/stock-produit.component';
import { CreditFormComponent } from './feature/credit-form/credit-form.component';
import { SharedVolumeComponent } from './ui/shared-volume/shared-volume.component';
import { FactureComponent } from './feature/facture/facture.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProvisionningRoutingModule } from './provisionning-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';

//Modules Primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';

//Components
import { CommandeFormComponent } from './feature/commande-form/commande-form.component';
import { CommandeSimComponent } from './ui/commande-sim/commande-sim.component';
import { LigneCreditComponent } from './ui/ligne-credit/ligne-credit.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        ProvisionningRoutingModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        DialogModule,
        TooltipModule,
        NgxPaginationModule,
        InputMaskModule,
        PasswordModule,
        RadioButtonModule,
        CalendarModule,
        NgxCaptchaModule
    ],
    declarations: [
        CommandeSimComponent,
        LigneCreditComponent,
        StockProduitComponent,
        SharedVolumeComponent,
        CommandeFormComponent,
        FactureComponent,
        CreditFormComponent,
        CardStockComponent
    ],
})
export class ProvisionningModule { }
