import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactureComponent } from './ui/facture/facture.component';

export const FACTURE = 'facture';

const routes: Routes = [
    {
        path: FACTURE,
        children: [
            {
                path: '',
                component: FactureComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComptabiliteRoutingModule {}
