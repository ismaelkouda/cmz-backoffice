import { FormIdentificationComponent } from './feature/form-identification/form-identification.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../../../shared/shared.module';
import { GestionIdentificationsRoutingModule } from './gestion-identifications-routing.module';
import { GestionIdentificationsService } from './data-access/gestion-identifications.service';
import { StateFileAttenteService } from './data-access/file-attente/state-file-attente.service';
import { FileAttenteComponent } from './ui/file-attente/file-attente.component'
import { FilterFileAttenteComponent } from './feature/file-attente/filter-file-attente/filter-file-attente.component';
import { TableFileAttenteComponent } from './feature/file-attente/table-file-attente/table-file-attente.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
    declarations: [
        FileAttenteComponent, FilterFileAttenteComponent, TableFileAttenteComponent,
        FormIdentificationComponent
    ],
    imports: [
        GestionIdentificationsRoutingModule,
        SharedModule,
        NgbModule,
        AngularMultiSelectModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    providers: [
        GestionIdentificationsService,
        StateFileAttenteService,
    ]
})

export class GestionIdentificationsModule {}