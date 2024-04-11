import { PortailComponent } from './portail/portail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const LOGIN = 'login'
export const PORTAIL = 'portail'

const routes: Routes = [{
  path: "",
  children: [
    {
      path: LOGIN,
      component: LoginComponent
    },
    {
      path: PORTAIL,
      component: PortailComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
