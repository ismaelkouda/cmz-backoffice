import { FormAchatProduitsComponent } from './feature/form-achat-produits/form-achat-produits.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { AchatProduitsComponent } from './ui/achat-produits/achat-produits.component';
import { DetailsAchatProduitsComponent } from './feature/details-achat-produits/details-achat-produits.component';
import { InvoiceFormComponent } from '../../../shared/components/invoice-form/invoice-form.component';
// import { DetailsAchatProduitsComponent } from './features/achat-produits/details-achat-produits/details-achat-produits.component';

export const ACHAT_PRODUIT = "achat-produit";
export const FORM = "form";
export const DETAILS = "details";
export const FACTURE = "invoice";

const routes: Routes = [
    {
        path: ACHAT_PRODUIT,
        children: [
            {
                path: '',
                component: AchatProduitsComponent,
            },
            {
                path: FORM,
                component: FormAchatProduitsComponent,
            },
            {
                path: FACTURE+"/:numero_demande",
                component: InvoiceFormComponent,
            },
            {
                path: DETAILS+"/:numero_demande",
                component: DetailsAchatProduitsComponent,
            },
            {
              path: '**',
              redirectTo: '',
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: []
})
export class DemandesProduitsRoutingModule {  }