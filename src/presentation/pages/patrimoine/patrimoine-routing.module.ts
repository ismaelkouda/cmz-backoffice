import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { GroupeSimComponent } from './ui/groupe-sim/groupe-sim.component';
import { DotationServiceComponent } from './ui/dotation-service/dotation-service.component';
import { EtatSoldeComponent } from './ui/etat-solde/etat-solde.component';
import { DownloadComponent } from './ui/download/download.component';

export const CARTES_SIM = 'cartes-sim';
export const ETAT_SOLDE = 'etat-solde';
export const LIFECYCLE_SIM = 'cycle-de-vie-sim';
export const GROUPE_SIM = 'groupe-sim';
export const DOTATION_SERVICES = 'dotation-services';
export const DOWNLOAD_FILE = 'telechargements';

const routes: Routes = [{
    path: "",
    children: [
        {
            path: CARTES_SIM,
            component: CarteSimActiveComponent
        },
        {
            path: ETAT_SOLDE,
            component: EtatSoldeComponent
        },
        {
            path: GROUPE_SIM,
            component: GroupeSimComponent
        },
        {
            path: DOTATION_SERVICES,
            component: DotationServiceComponent
        },
        {
            path: DOWNLOAD_FILE,
            component: DownloadComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatrimoineRoutingModule { }
