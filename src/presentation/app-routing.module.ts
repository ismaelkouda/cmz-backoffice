import { AuthGuard } from './../core/guard/auth.guard';
import { full } from './../shared/routes/full.routes';
import { content, DASHBOARD } from './../shared/routes/routes';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContentComponent } from "src/shared/components/layout/content/content.component";
import { FullComponent } from 'src/shared/components/layout/full/full.component';

export const REINITIALISATION = 'reinitialisation';
export const AUTH = "auth";

const routes: Routes = [
  {
    path: AUTH,
    loadChildren: () =>
      import("./pages/authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: REINITIALISATION,
    loadChildren: () => import("../presentation/pages/password-reset/password-reset.module").then((m) => m.PasswordResetModule),
  },
  {
    path: "",
    component: ContentComponent,
    children: content,
    canActivate: [AuthGuard]
  },
  // {
  //   path: "",
  //   component: FullComponent,
  //   children: full
  // },
  {
    path: '',
    redirectTo: DASHBOARD,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    [
      RouterModule.forRoot(routes, {
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled",
      }),
    ],
  ],
})
export class AppRoutingModule { }
