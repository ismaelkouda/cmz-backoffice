import { full } from './../shared/routes/full.routes';
import { content } from './../shared/routes/routes';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContentComponent } from "src/shared/components/layout/content/content.component";
import { FullComponent } from 'src/shared/components/layout/full/full.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'réinitialisation',
    loadChildren: () => import("../presentation/pages/password-reset/password-reset.module").then((m) => m.PasswordResetModule),
  },
  {
    path: "",
    component: ContentComponent,
    children: content
  },
  {
    path: "",
    component: FullComponent,
    children: full
  },
  {
    path: "**",
    redirectTo: "",
  },
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
