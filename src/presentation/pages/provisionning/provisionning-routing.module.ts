import { StockProduitComponent } from './ui/stock-produit/stock-produit.component';
import { LigneCreditComponent } from './ui/ligne-credit/ligne-credit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandeSimComponent } from './ui/commande-sim/commande-sim.component';

export const COMMANDE_SIM = 'commande-produits';
export const LIGNE_CREDIT = 'ligne-credit';
export const STOCK_PRODUITS = 'stock-produits';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: LIGNE_CREDIT,
                component: LigneCreditComponent,
            },
            {
                path: COMMANDE_SIM,
                component: CommandeSimComponent,
            },
            {
                path: STOCK_PRODUITS,
                component: StockProduitComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProvisionningRoutingModule {}
