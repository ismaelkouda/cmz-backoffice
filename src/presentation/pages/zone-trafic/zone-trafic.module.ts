import { SitesWrapperComponent } from './feature/sites-wrapper/sites-wrapper.component';
import { CardSecondComponent } from './feature/card-second/card-second.component';
import { CarteComponent } from './feature/carte/carte.component';
import { VueGeographiqueComponent } from './ui/vue-geographique/vue-geographique.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ZoneTraficRoutingModule } from './zone-trafic-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
    declarations: [
        VueGeographiqueComponent,
        CarteComponent,
        CardSecondComponent,
        SitesWrapperComponent
    ],
    imports: [
        SharedModule,
        ZoneTraficRoutingModule,
        NgSelectModule,
        NgbModule,
        NgxPaginationModule
    ]
})
export class ZoneTraficModule { }
