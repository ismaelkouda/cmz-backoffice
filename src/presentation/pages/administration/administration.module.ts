import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { AdministrationRoutingModule } from './administration-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';

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
        SharedModule,
        AdministrationRoutingModule,
        NgxPaginationModule,
        NgxCaptchaModule,
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
        AffectationMembreComponent,
    ],
})
export class AdministrationModule {}
