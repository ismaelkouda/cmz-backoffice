import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD } from "src/shared/routes/routes";

const routes: Routes = [
  {
    path: DASHBOARD,
    component: DashboardComponent,
    data: { title: 'Tableau de bord' }
  },
  {
    path: '',
    redirectTo: DASHBOARD,
    pathMatch: 'full'
  },
  {
      path: '**',
      redirectTo: DASHBOARD,
      pathMatch: 'full'
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
