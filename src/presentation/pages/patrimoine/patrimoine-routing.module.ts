import { PatrimoineComponent } from './ui/patrimoine/patrimoine.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const CARTES_SIM = 'cartes-sim';

const routes: Routes = [{
    path: "",
    children: [
        {
            path: CARTES_SIM,
            component: PatrimoineComponent
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatrimoineRoutingModule { }
