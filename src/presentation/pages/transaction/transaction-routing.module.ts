import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimSwapComponent } from './ui/sim-swap/sim-swap.component';
import { ResiliationSimComponent } from './ui/resiliation-sim/resiliation-sim.component';

export const SUSPENSION = 'suspension';
export const RESILIATION = 'resiliation';
export const SIM_SWAP = 'swap-sim';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: RESILIATION,
                component: ResiliationSimComponent
            },
            {
                path: SIM_SWAP,
                component: SimSwapComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransactionRoutingModule { }
