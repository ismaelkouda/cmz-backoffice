import { UsersComponent } from './ui/users/users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilHabilitationComponent } from './ui/profil-habilitation/profil-habilitation.component';

export const PROFILS_HABILITATIONS = 'profils-habilitations';
export const UTILISATEURS = 'utilisateurs';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: PROFILS_HABILITATIONS,
                component: ProfilHabilitationComponent
            },
            {
                path: UTILISATEURS,
                component: UsersComponent
            }
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParametreSecuriteRoutingModule { }
