import { ConnexionFormComponent } from './feature/connexion-form/connexion-form.component';
import { ConnexionApiComponent } from './ui/connexion-api/connexion-api.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InterconnexionRoutingModule } from './interconnexion-routing.module';

@NgModule({
    declarations: [
        ConnexionApiComponent,
        ConnexionFormComponent
    ],
    imports: [
        SharedModule,
        InterconnexionRoutingModule,
        NgSelectModule,
        NgbModule,
    ]
})
export class InterconnexionModule { }
