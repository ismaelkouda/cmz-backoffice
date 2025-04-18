// import { DemandeIdentificationComponent } from './ui/demande-identification/demande-identification/demande-identification.component';
// import { FormDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/form-demande-identification/form-demande-identification.component';
// import { ManagementDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/management-demande-identification/management-demande-identification.component';
import { DemandeFormuleChangeComponent } from './ui/demande-formule-change/demande-formule-change.component';
// import { DemandeResiliationComponent } from './ui/demande-resiliation/demande-resiliation.component';
// import { DemandeSuspensionComponent } from './ui/demande-suspension/demande-suspension.component';
// import { DemandeActivationComponent } from './ui/demande-activation/demande-activation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandeSwappingComponent } from './ui/demande-swapping/demande-swapping.component';
import { DemandeIntegrationComponent } from './ui/demande-integration/demande-integration.component';
import { FormDemandeIntegrationComponent } from './feature/demande-integration/form-demande-integration/form-demande-integration.component';
import { DossierDemandeIntegrationComponent } from './feature/demande-integration/dossier-demande-integration/dossier-demande-integration.component';

export const DEMANDE_ACTIVATION = 'activation';
export const DEMANDE_SUSPENSION = 'suspension';
export const DEMANDE_RESILIATION = 'resiliation';
export const DEMANDE_SWAPPING = 'changement-carte-sim';
export const DEMANDE_FORMULE_CHANGE = 'changement-formule';
export const DEMANDE_INTEGRATION = 'integration';
export const DEMANDE_INTEGRATION_FORM = 'form';
export const DEMANDE_INTEGRATION_DOSSIER = 'dossier';
export const DEMANDE_IDENTIFICATION_FORM = 'form';
export const DEMANDE_IDENTIFICATION = 'identification';
export const DEMANDE_IDENTIFICATION_DOSSIER = 'dossier';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: DEMANDE_ACTIVATION,
                children: [
                    // {
                    //     path: '',
                    //     component: DemandeActivationComponent,
                    // },
                    // {
                    //   path: '**',
                    //   redirectTo: '',
                    // },
                ],
            },
            // {
            //     path: DEMANDE_INTEGRATION,
            //     children: [
            //         {
            //             path: '',
            //             component: DemandeIntegrationComponent,
            //         },
            //         {
            //             path: DEMANDE_INTEGRATION_FORM + "/:id",
            //             component: FormDemandeIntegrationComponent,
            //         },
            //         {
            //             path: DEMANDE_INTEGRATION_DOSSIER + "/:id",
            //             component: DossierDemandeIntegrationComponent,
            //         },
            //         {
            //             path: '',
            //             redirectTo: DEMANDE_INTEGRATION,
            //         }
            //     ]
            // },
            // {
            //     path: DEMANDE_SUSPENSION,
            //     component: DemandeSuspensionComponent
            // },
            // {
            //     path: DEMANDE_RESILIATION,
            //     component: DemandeResiliationComponent
            // },
            // {
            //     path: DEMANDE_SWAPPING,
            //     component: DemandeSwappingComponent
            // },
            // {
            //     path: DEMANDE_FORMULE_CHANGE,
            //     component: DemandeFormuleChangeComponent
            // },
            //         {
            //             path: DEMANDE_IDENTIFICATION,
            //             children: [
            //                 {
            //                     path: '',
            //                     component: DemandeIdentificationComponent,
            //                 },

            //                 {
            //                     path: DEMANDE_IDENTIFICATION_FORM + "/:id",
            //                     component: FormDemandeIdentificationComponent
            //                 },
            //                 {
            //                     path:DEMANDE_IDENTIFICATION_DOSSIER + "/:id",
            //                     component: ManagementDemandeIdentificationComponent
            //                 },
            //                 {
            //                     path: '',
            //                     redirectTo: DEMANDE_IDENTIFICATION,
            //                 }
            //             ]
            //         },
        ],
    },
    {
        path: '**',
        redirectTo: DEMANDE_ACTIVATION,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DemandesRoutingModule {}
