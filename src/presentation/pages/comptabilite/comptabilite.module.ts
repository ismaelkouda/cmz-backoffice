import { NgModule } from '@angular/core';
import { ComptabiliteRoutingModule } from './comptabilite-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';
import { FactureComponent } from './ui/facture/facture.component';
import { ComptabiliteService } from './data-access/comptabilite.service';
import { StateFactureService } from './data-access/facture/state-facture.service';
import { FilterFactureComponent } from './feature/filter-facture/filter-facture.component';
import { TableFactureComponent } from './feature/table-facture/table-facture.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [
        FactureComponent,
        FilterFactureComponent,
        TableFactureComponent,
    ],

    imports: [
        SharedModule,
        ComptabiliteRoutingModule,
        NgxPaginationModule,
        NgxPaginationModule,
        NgxCaptchaModule,
    ],

    exports: [],

    providers: [ComptabiliteService, StateFactureService],
})
export class ComptabiliteModule {}
