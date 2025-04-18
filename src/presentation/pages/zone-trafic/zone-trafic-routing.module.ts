import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VueGeographiqueComponent } from './ui/vue-geographique/vue-geographique.component';

export const VUE_GEOGRAPHIQUE = 'zone-exploitation';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                component: VueGeographiqueComponent,
                path: VUE_GEOGRAPHIQUE,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ZoneTraficRoutingModule {}
