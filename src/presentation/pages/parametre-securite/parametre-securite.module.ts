import { AdminFormComponent } from './feature/admin-form/admin-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';

//Components
import { ProfilHabilitationComponent } from './ui/profil-habilitation/profil-habilitation.component';
import { UsersComponent } from './ui/users/users.component';
import { VisualisationComponent } from './feature/visualisation/visualisation.component';
import { AffectationComponent } from './feature/affectation/affectation.component';
import { FormsProfilComponent } from './feature/forms-profil/forms-profil.component';

//Modules Primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NgxPaginationModule } from 'ngx-pagination';
import { ParametreSecuriteRoutingModule } from './parametre-securite-routing.module';
import { TreeModule } from 'primeng/tree';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        ParametreSecuriteRoutingModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        CheckboxModule,
        DialogModule,
        TooltipModule,
        InputSwitchModule,
        NgxPaginationModule,
        TreeModule
    ],
    declarations: [
        ProfilHabilitationComponent,
        UsersComponent,
        AffectationComponent,
        VisualisationComponent,
        FormsProfilComponent,
        AdminFormComponent,
    ]
})
export class ParametreSecuriteModule { }
