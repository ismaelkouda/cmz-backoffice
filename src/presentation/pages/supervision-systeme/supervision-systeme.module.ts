import { SupervisionSystemeRoutingModule } from './supervision-systeme-routing.module';
import { NgModule, } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EtatsServicesComponent } from './ui/etats-services/etats-services.component';
import { TauxDesChargesComponent } from './ui/taux-des-charges/taux-des-charges.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
    declarations: [
        EtatsServicesComponent,
        TauxDesChargesComponent
    ],
    imports: [
        SharedModule,
        SupervisionSystemeRoutingModule,
        NgSelectModule,
        NgbModule,
        AngularMultiSelectModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
    ]
})
export class SupervisionSystemeModule { }
