import { PriseEnChargeComponent } from './feature/prise-en-charge/prise-en-charge.component';
import { TransactionsComponent } from './feature/transactions/transactions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuivieTraitementComponent } from './feature/suivie-traitement/suivie-traitement.component';
import { AlarmesComponent } from './feature/alarmes/alarmes.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'statuts',
                component: AlarmesComponent,
            },
            {
                path: 'prise-en-charge',
                component: PriseEnChargeComponent,
            },
            {
                path: 'suivie-et-traitements',
                component: SuivieTraitementComponent,
            },
            {
                path: 'transactions',
                component: TransactionsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SupervisionOperationsRoutingModule { }
