import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesAuthorizationsComponent } from './ui/profiles-authorizations/profiles-authorizations.component';
import { FormProfilesAuthorizationsComponent } from './features/profiles-authorizations/form-profiles-authorizations/form-profiles-authorizations.component';

export const PROFILES_AUTHORIZATIONS = 'profiles-authorizations';
export const FORM = 'form';

export const PROFILS_HABILITATIONS = 'profils-habilitations';
const routes: Routes = [
    {
        path: PROFILS_HABILITATIONS,
        children: [
            {
                path: '',
                component: ProfilesAuthorizationsComponent,
            },
            {
                path: `${FORM}/:id`,
                component: FormProfilesAuthorizationsComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${CUSTOMERS_ACTIVATE}`],
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParameterSecurityRoutingModule {}
