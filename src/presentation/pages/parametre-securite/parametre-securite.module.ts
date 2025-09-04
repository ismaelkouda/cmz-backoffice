import { JournalAuthenticationComponent } from './ui/journal-authentication/journal-authentication.component';
import { AdminFormComponent } from './feature/admin-form/admin-form.component';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';

//Components
import { ProfilHabilitationComponent } from './ui/profil-habilitation/profil-habilitation.component';
import { UsersComponent } from './ui/users/users.component';
import { VisualisationComponent } from './feature/visualisation/visualisation.component';
import { AffectationComponent } from './feature/affectation/affectation.component';
import { FormsProfilComponent } from './feature/forms-profil/forms-profil.component';

//Modules Primeng
import { NgxPaginationModule } from 'ngx-pagination';
import { ParametreSecuriteRoutingModule } from './parametre-securite-routing.module';

import { FormsProfilApiService } from './data-access/services/forms-profil/forms-profil.service';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';

@NgModule({
    declarations: [
        ProfilHabilitationComponent,
        UsersComponent,
        AffectationComponent,
        VisualisationComponent,
        FormsProfilComponent,
        AdminFormComponent,
        JournalAuthenticationComponent,
    ],
    imports: [
        SharedModule,
        ParametreSecuriteRoutingModule,
        NgxPaginationModule,
        TreeSelectModule,
        TreeTableModule,
    ],
    providers: [FormsProfilApiService],
})
export class ParametreSecuriteModule {}
