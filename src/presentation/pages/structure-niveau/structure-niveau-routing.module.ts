import { ThirdLevelComponent } from './ui/third-level/third-level.component';
import { SecondLevelComponent } from './ui/second-level/second-level.component';
import { FirstLevelComponent } from './ui/first-level/first-level.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsageMetierComponent } from './ui/usage-metier/usage-metier.component';

export const FIRST_LEVEL_ROUTE = 'niveau-1';
export const SECOND_LEVEL_ROUTE = 'niveau-2';
export const THRID_LEVEL_ROUTE = 'niveau-3';
export const USAGE_METIER = 'usage-metier';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: FIRST_LEVEL_ROUTE,
                component: FirstLevelComponent
            },
            {
                path: SECOND_LEVEL_ROUTE,
                component: SecondLevelComponent
            },
            {
                path: THRID_LEVEL_ROUTE,
                component: ThirdLevelComponent
            },
            {
                path: USAGE_METIER,
                component: UsageMetierComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StructureNiveauRoutingModule { }
