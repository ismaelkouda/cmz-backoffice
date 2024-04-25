import { DemandeFormuleChangeComponent } from './ui/demande-formule-change/demande-formule-change.component';
import { DemandeResiliationComponent } from './ui/demande-resiliation/demande-resiliation.component';
import { DemandeSuspensionComponent } from './ui/demande-suspension/demande-suspension.component';
import { DemandeActivationComponent } from './ui/demande-activation/demande-activation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandeSwappingComponent } from './ui/demande-swapping/demande-swapping.component';

export const DEMANDE_ACTIVATION = 'activation';
export const DEMANDE_SUSPENSION = 'suspension';
export const DEMANDE_RESILIATION = 'resiliation';
export const DEMANDE_SWAPPING = 'changement-carte-sim';
export const DEMANDE_FORMULE_CHANGE = 'changement-formule';


const routes: Routes = [{
    path: "",
    children: [
        {
            path: DEMANDE_ACTIVATION,
            component: DemandeActivationComponent
        },
        {
            path: DEMANDE_SUSPENSION,
            component: DemandeSuspensionComponent
        },
        {
            path: DEMANDE_RESILIATION,
            component: DemandeResiliationComponent
        },
        {
            path: DEMANDE_SWAPPING,
            component: DemandeSwappingComponent
        },
        {
            path: DEMANDE_FORMULE_CHANGE,
            component: DemandeFormuleChangeComponent
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DemandesRoutingModule { }
