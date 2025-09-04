import { TabsComponent } from './components/tabs/tabs.component';
import { ConfirmationModalComponent } from './components/tabs/confirmation-modal.component';
import { TreatmentRequestsServiceFormComponent } from './components/treatment-requests-service-form/treatment-requests-service-form.component';
import { ParginationComponent } from './components/pargination/pargination.component';
import { TablebuttonHeaderComponent } from './components/table-button-header/table-button-header.component';
import { TableTitleComponent } from './components/table-title/table-title.component';
import { PatrimoineHeaderComponent } from './components/patrimoine-header/patrimoine-header.component';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { JournalComponent } from './components/journal/journal.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CapitalizePipe } from './pipes/capitalize.pipe';

// Components
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/layout/content/content.component';
import { FullComponent } from './components/layout/full/full.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';
import { MyAccountComponent } from './components/header/elements/my-account/my-account.component';

// Services
import { LayoutService } from './services/layout.service';
import { NavService } from './services/nav.service';
import { DecimalPipe } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SwiperModule } from 'swiper/angular';

//Primeng Modules
import { PrimengModule } from './primeng.module';

import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { AngularModule } from './angular.module';
import { PagesGuard } from '../core/guard/PagesGuard';
import { TreatmentMonitoringApiService } from '../presentation/pages/overseeing-operations/data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { TreatmentRequestsServiceFormApiService } from './components/treatment-requests-service-form/data-access/services/treatment-requests-service-form-api.service';
import { InvoiceFormApiService } from './components/invoice-form/data-access/services/invoice-form-api.service';

@NgModule({
    declarations: [
        InvoiceFormComponent,
        HeaderComponent,
        FooterComponent,
        SearchTableComponent,
        SidebarComponent,
        ContentComponent,
        BreadcrumbComponent,
        FullComponent,
        LoaderComponent,
        TapToTopComponent,
        MyAccountComponent,
        JournalComponent,
        PatrimoineHeaderComponent,
        QrModalComponent,
        TablebuttonHeaderComponent,
        ParginationComponent,
        CapitalizePipe,
        TableTitleComponent,
        TreatmentRequestsServiceFormComponent,
        ConfirmationModalComponent,
        TabsComponent,
    ],
    imports: [
        AngularModule,
        PrimengModule,
        TranslateModule,
        CarouselModule,
        SwiperModule,
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
        PrimengModule,
        TranslateModule,
        InvoiceFormComponent,
        LoaderComponent,
        SearchTableComponent,
        BreadcrumbComponent,
        JournalComponent,
        QrModalComponent,
        TapToTopComponent,
        PatrimoineHeaderComponent,
        SwiperModule,
        TablebuttonHeaderComponent,
        ParginationComponent,
        CapitalizePipe,
        TableTitleComponent,
        TreatmentRequestsServiceFormComponent,
        TabsComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
