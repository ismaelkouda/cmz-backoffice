import { OperationFormsComponent } from './ui/operation-forms/operation-forms.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const OPERATION_FORM = 'operation'

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: OPERATION_FORM,
                component: OperationFormsComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OperationSimRoutingModule { }
