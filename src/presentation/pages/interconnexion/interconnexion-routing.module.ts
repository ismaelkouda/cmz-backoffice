import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionApiComponent } from './ui/connexion-api/connexion-api.component';

export const CONNEXION_API = 'connexion-api';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: CONNEXION_API,
                component: ConnexionApiComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InterconnexionRoutingModule {}
