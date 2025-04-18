import { LigneShowComponent } from './feature/ligne-show/ligne-show.component';
import { CommandeShowComponent } from './feature/commande-show/commande-show.component';
import { CardStockComponent } from './feature/card-stock/card-stock.component';
import { StockProduitComponent } from './ui/stock-produit/stock-produit.component';
import { CreditFormComponent } from './feature/credit-form/credit-form.component';
import { FactureComponent } from './feature/facture/facture.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProvisionningRoutingModule } from './provisionning-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';

//Components
import { CommandeFormComponent } from './feature/commande-form/commande-form.component';
import { CommandeSimComponent } from './ui/commande-sim/commande-sim.component';
import { LigneCreditComponent } from './ui/ligne-credit/ligne-credit.component';

@NgModule({
    imports: [
        SharedModule,
        ProvisionningRoutingModule,
        NgxPaginationModule,
        NgxCaptchaModule,
    ],
    declarations: [
        CommandeSimComponent,
        LigneCreditComponent,
        StockProduitComponent,
        CommandeFormComponent,
        CommandeShowComponent,
        LigneShowComponent,
        FactureComponent,
        CreditFormComponent,
        CardStockComponent,
    ],
})
export class ProvisionningModule {}
