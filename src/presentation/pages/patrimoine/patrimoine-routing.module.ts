import { LifecycleSimComponent } from './ui/lifecycle-sim/lifecycle-sim.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { TransactionSimComponent } from './ui/transaction-sim/transaction-sim.component';

export const CARTES_SIM = 'cartes-sim';
export const LIFECYCLE_SIM = 'cycle-de-vie-sim';
export const TRANSACTION_SIM = 'transaction-sur-sim';

const routes: Routes = [{
    path: "",
    children: [
        {
            path: CARTES_SIM,
            component: CarteSimActiveComponent
        },
        {
            path: LIFECYCLE_SIM,
            component: LifecycleSimComponent
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
