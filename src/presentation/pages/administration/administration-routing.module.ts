import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentesComponent } from './ui/ventes/ventes.component';
import { StockComponent } from './ui/stock/stock.component';
import { ProductsComponent } from './ui/products/products.component';
import { AchatsComponent } from './ui/achats/achats.component';

export const ADMIN_VENTE = 'ventes';
export const ADMIN_STOCK = 'stock';
export const ADMIN_PRODUCT = 'produits';
export const ADMIN_ACHAT = 'achats';

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
        }
    ]
}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }
