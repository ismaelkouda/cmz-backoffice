import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { RequestsProductsRoutingModule } from './requests-products-routing.module';
import { FilterWhiteSimComponent } from './feature/white-sim/filter-white-sim/filter-white-sim.component';
import { TableWhiteSimComponent } from './feature/white-sim/table-white-sim/table-white-sim.component';
import { WhiteSimComponent } from './ui/white-sim/white-sim.component';
import { CommandWhiteSimApiService } from './data-access/white-sim/services/white-sim-api.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    FilterWhiteSimComponent, TableWhiteSimComponent, WhiteSimComponent,
  ],
  imports: [
    SharedModule,
    RequestsProductsRoutingModule,
    NgSelectModule,
    NgbModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ],
  providers: [CommandWhiteSimApiService]
})
export class RequestsProductsModule { }
