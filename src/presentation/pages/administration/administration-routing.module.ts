import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentesComponent } from './ui/ventes/ventes.component';
import { StockComponent } from './ui/stock/stock.component';
import { ProductsComponent } from './ui/products/products.component';
import { AchatsComponent } from './ui/achats/achats.component';
import { ListClientsComponent } from './ui/clients/list-clients/list-clients.component';
import { HistoriqueActivationComponent } from './ui/clients/historique-activation/historique-activation.component';
import { GroupesComponent } from './ui/clients/groupes/groupes.component';
import { PointVentesComponent } from './ui/clients/point-ventes/point-ventes.component';

export const ADMIN_VENTE = 'ventes';
export const ADMIN_STOCK = 'stock';
export const ADMIN_PRODUCT = 'produits';
export const ADMIN_ACHAT = 'achats';
export const ADMIN_CLIENT = 'clients';
export const ADMIN_ACTIVATION_HISTORIE = 'historique-activation';
export const ADMIN_GROUPE = 'groupes';
export const ADMIN_POINT_VENTE = 'point-ventes';




const routes: Routes = [{
    path: "",
    children: [
        {
            path: ADMIN_VENTE,
            component: VentesComponent
        },
        {
            path: ADMIN_STOCK,
            component: StockComponent
        },
        {
            path: ADMIN_PRODUCT,
            component: ProductsComponent
        },
        {
            path: ADMIN_ACHAT,
            component: AchatsComponent
        },
        {
            path: ADMIN_CLIENT,
            component: ListClientsComponent
        },
        {
            path: ADMIN_ACTIVATION_HISTORIE,
            component: HistoriqueActivationComponent
        },
        {
            path: ADMIN_GROUPE,
            component: GroupesComponent
        },
        {
            path: ADMIN_POINT_VENTE,
            component: PointVentesComponent
        }
    ]
}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }
