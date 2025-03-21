import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './ui/invoice/invoice.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';

export const WAITING = 'invoice';

const routes: Routes = [
  {
    path: WAITING,
    children: [
      {
        path: '',
        component: InvoiceComponent
      },
      {
        path: '**',
        redirectTo: ''
      },
    ],
    canActivate: [PagesGuard],
    data: {
      allowedPaths: [`/${WAITING}`]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
