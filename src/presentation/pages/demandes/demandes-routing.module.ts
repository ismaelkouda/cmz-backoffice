import { DemandeResiliationComponent } from './ui/demande-resiliation/demande-resiliation.component';
import { DemandeSuspensionComponent } from './ui/demande-suspension/demande-suspension.component';
import { DemandeActivationComponent } from './ui/demande-activation/demande-activation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const DEMANDE_ACTIVATION = 'activation';
export const DEMANDE_SUSPENSION = 'suspension';
export const DEMANDE_RESILIATION = 'resiliation';


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
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DemandesRoutingModule { }
