import { UsersComponent } from './ui/users/users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilHabilitationComponent } from './ui/profil-habilitation/profil-habilitation.component';
import { JournalAuthenticationComponent } from './ui/journal-authentication/journal-authentication.component';

export const PROFILS_HABILITATIONS = 'profils-habilitations';
export const UTILISATEURS = 'utilisateurs';
export const JOURNAL_ATHENTICATION = 'journaux-authentification';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: PROFILS_HABILITATIONS,
                component: ProfilHabilitationComponent,
            },
            {
                path: UTILISATEURS,
                component: UsersComponent,
            },
            {
                path: JOURNAL_ATHENTICATION,
                component: JournalAuthenticationComponent,
            },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParametreSecuriteRoutingModule {}
