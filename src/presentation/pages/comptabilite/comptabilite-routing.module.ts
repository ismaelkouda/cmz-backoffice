import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FactureComponent } from "./ui/facture/facture.component";
import { InvoiceFormComponent } from "../../../shared/components/invoice-form/invoice-form.component";

export const FACTURE = "facture";

const routes: Routes = [
  {
    path: FACTURE,
    children: [
      {
        path: '',
        component: FactureComponent
      },
      {
        path: ":numero_demande",
        component: InvoiceFormComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComptabiliteRoutingModule { }
