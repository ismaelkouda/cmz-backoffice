import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

// Components

// Services
import { DecimalPipe } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LayoutService } from './services/layout.service';
import { NavService } from './services/nav.service';

//Primeng Modules

import { PagesGuard } from '../core/guard/PagesGuard';
import { TreatmentMonitoringApiService } from '../presentation/pages/overseeing-operations/data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { AngularModule } from './angular.module';
import { InvoiceFormApiService } from './components/invoice-form/data-access/services/invoice-form-api.service';
import { TreatmentRequestsServiceFormApiService } from './components/treatment-requests-service-form/data-access/services/treatment-requests-service-form-api.service';

@NgModule({
    declarations: [
        //HeaderComponent,
        //FooterComponent,
        //ContentComponent,
        //MyAccountComponent,
        //ParginationComponent,
        //ConfirmationModalComponent,
        //FullComponent,
        //SidebarComponent,
        //InvoiceFormComponent,
        //LoaderComponent,
        //SearchTableComponent,
        //BreadcrumbComponent,
        //JournalComponent,
        //QrModalComponent,
        //TapToTopComponent,
        //PatrimoineHeaderComponent,
        //TablebuttonHeaderComponent,
        //CapitalizePipe,
        //TableTitleComponent,
        //TreatmentRequestsServiceFormComponent,
        //TabsComponent,
    ],
    imports: [
        AngularModule,
        //PrimengModule,
        TranslateModule,
        CarouselModule,
        NgxPaginationModule,
    ],
    providers: [
        NavService,
        LayoutService,
        DecimalPipe,
        TreatmentMonitoringApiService,
        TreatmentRequestsServiceFormApiService,
        InvoiceFormApiService,
        PagesGuard,
    ],
    exports: [
        AngularModule,
        //PrimengModule,
        TranslateModule,
        //InvoiceFormComponent,
        //LoaderComponent,
        //SearchTableComponent,
        //BreadcrumbComponent,
        //JournalComponent,
        //QrModalComponent,
        //TapToTopComponent,
        //PatrimoineHeaderComponent,
        //TablebuttonHeaderComponent,
        //ParginationComponent,
        //CapitalizePipe,
        //TableTitleComponent,
        //TreatmentRequestsServiceFormComponent,
        //TabsComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
