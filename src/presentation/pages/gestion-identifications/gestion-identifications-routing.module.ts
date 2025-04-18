import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileAttenteComponent } from './ui/file-attente/file-attente.component';

export const FILE_ATTENTE_ROUTE = 'file-attente';
export const PERSONNE_PHYSIQUE = 'personne-physique';
export const EQUIPEMENTS_CONNECTE = 'equipement-connecte';

const routes: Routes = [
    {
        path: FILE_ATTENTE_ROUTE,
        component: FileAttenteComponent,
    },
    // {
    //   path: TRAITEMENT_AUTO,
    //   children: [
    //     {
    //       path: '',
    //       component: TraitementAutoComponent
    //     }
    //   ]
    // },
    // {
    //   path: TRAITEMENT_REJETS,
    //   component: TraitementRejetsComponent,
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GestionIdentificationsRoutingModule {}
