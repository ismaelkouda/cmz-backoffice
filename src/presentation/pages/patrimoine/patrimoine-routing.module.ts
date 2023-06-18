import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { TransactionSimComponent } from './ui/transaction-sim/transaction-sim.component';

export const CARTES_SIM_ACTIVES = 'cartes-sim';
export const TRANSACTION_SIM = 'transaction-sur-sim';

const routes: Routes = [{
    path: "",
    children: [
        {
            path: CARTES_SIM_ACTIVES,
            component: CarteSimActiveComponent
        },
        {
            path: TRANSACTION_SIM,
            component: TransactionSimComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatrimoineRoutingModule { }
