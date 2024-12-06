import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarteSimActiveComponent } from './ui/carte-sim-active/carte-sim-active.component';
import { GroupeSimComponent } from './ui/groupe-sim/groupe-sim.component';
import { DotationServiceComponent } from './ui/dotation-service/dotation-service.component';
import { DownloadComponent } from './ui/download/download.component';
import { CartographieComponent } from './ui/cartographie/cartographie.component';
import { CartesSimComponent } from './ui/cartes-sim/cartes-sim.component';
import { CarteSimFormComponent } from './feature/carte-sim/carte-sim-form/carte-sim-form.component';
import { EtatSoldeComponent } from './ui/etat-solde/etat-solde.component';

export const CARTES_SIM = 'cartes-sim';
export const ETAT_SOLDE = 'etat-solde';
export const LIFECYCLE_SIM = 'cycle-de-vie-sim';
export const GROUPE_SIM = 'groupe-sim';
export const DOTATION_SERVICES = 'dotation-services';
export const DOWNLOAD_FILE = 'telechargements';
export const CARTOGRAPHIE = 'cartographie';

const routes: Routes = [
    { 
    path: CARTES_SIM,
    children: [
        // {
        //     path: CARTES_SIM,
        //     component: CarteSimActiveComponent
        // }, 
        {
            path: '',
            component: CartesSimComponent
        },
        {
            path: ":id",
            component: CarteSimFormComponent
        },
        
    ]
},
{
    path: CARTOGRAPHIE,
    component: CartographieComponent
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatrimoineRoutingModule { }
