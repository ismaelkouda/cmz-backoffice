import { StockProduitComponent } from './ui/stock-produit/stock-produit.component';
import { LigneCreditComponent } from './ui/ligne-credit/ligne-credit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandeSimComponent } from './ui/commande-sim/commande-sim.component';
import { SharedVolumeComponent } from './ui/shared-volume/shared-volume.component';

export const COMMANDE_SIM = 'commande-cartes-sim';
export const LIGNE_CREDIT = 'ligne-credit';
export const STOCK_PRODUITS = 'stock-produits';
export const SHARED_VOLUME = 'volume-partage';


const routes: Routes = [{
    path: "",
    children: [
        {
            path: COMMANDE_SIM,
            component: CommandeSimComponent
        },
        {
            path: LIGNE_CREDIT,
            component: LigneCreditComponent
        },
        {
            path: STOCK_PRODUITS,
            component: StockProduitComponent
        },
        {
            path: SHARED_VOLUME,
            component: SharedVolumeComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProvisionningRoutingModule { }
