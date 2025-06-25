// import { TransactionShowComponent } from './components/transaction-show/transaction-show.component';
import { ParginationComponent } from './components/pargination/pargination.component';
import { TablebuttonHeaderComponent } from './components/table-button-header/table-button-header.component';
import { TableTitleComponent } from './components/table-title/table-title.component';
import { StatistiqueBoxComponent } from './components/statistique-box/statistique-box.component';
import { SharedDataService } from './services/shared-data.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormMasseComponent } from './components/form-masse/form-masse.component';
import { TransactionMasseComponent } from './components/transaction-masse/transaction-masse.component';
import { PatrimoineHeaderComponent } from './components/patrimoine-header/patrimoine-header.component';
import { TabViewHeaderComponent } from './components/tab-view-header/tab-view-header.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { StatutContratComponent } from './components/statut-contrat/statut-contrat.component';
import { FormatNumberPipe } from './pipes/formatNumber.pipe';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { CountBoxComponent } from './components/count-box/count-box.component';
import { StatBoxComponent } from './components/stat-box/stat-box.component';
import { JournalComponent } from './components/journal/journal.component';
import { SafePipe } from './pipes/safe.pipe';
import { HistoriqueComponent } from './components/historique/historique.component';
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
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SwiperModule } from 'swiper/angular';

//Primeng Modules
import { TableFilterPipe } from './pipes/table-filter.pipe';
import { TraitementShowComponent } from './components/traitement-show/traitement-show.component';
import { SpinnerTitleDetailsComponent } from './components/spinner-title-details/spinner-title-details.component';
import { BoxContainerComponent } from './components/box-container/box-container.component';
import { PrimengModule } from './primeng.module';

import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { AngularModule } from './angular.module';
import { FormFolderComponent } from './components/form-folder/form-folder.component';
import { SimDemandComponent } from './components/sim-demand/sim-demand.component';
import { TableSimDemandComponent } from './components/sim-demand/feature/table-sim-demand/table-sim-demand.component';
import { FilterSimDemandComponent } from './components/sim-demand/feature/filter-sim-demand/filter-sim-demand.component';
import { HistoryApiService } from './components/historique/data-access/services/history-api.service';
import { EndpointParamsService } from './services/endpoint-params.service';
import { HistoryComponent } from './components/historique/history.component';
import { FilterHistoryComponent } from './components/historique/feature/filter-history/filter-history.component';
import { TableHistoryComponent } from './components/historique/feature/table-history/table-history.component';
import { DetailsHistoryComponent } from './components/historique/feature/details-history/details-history.component';
import { PagesGuard } from '../core/guard/PagesGuard';
import { TreatmentMonitoringApiService } from '../presentation/pages/overseeing-operations/data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { FormDemandComponent } from './components/form-demand/form-demand.component';
import { FormDemandApiService } from './components/form-demand/data-access/services/form-demand-api.service';
import { FormSimDemandComponent } from './components/sim-demand/feature/form-sim-demand/form-sim-demand.component';

@NgModule({
    declarations: [
        InvoiceFormComponent,
        HeaderComponent,
        FooterComponent,
        SearchTableComponent,
        SidebarComponent,
        ContentComponent,
        BreadcrumbComponent,
        TraitementShowComponent,
        // TransactionShowComponent,
        BoxContainerComponent,
        FullComponent,
        LoaderComponent,
        StatBoxComponent,
        CountBoxComponent,
        TapToTopComponent,
        MyAccountComponent,
        SvgIconComponent,
        HistoryComponent,
        FilterHistoryComponent,
        TableHistoryComponent,
        DetailsHistoryComponent,
        HistoriqueComponent,
        JournalComponent,
        StatutContratComponent,
        TableHeaderComponent,
        TabViewHeaderComponent,
        PatrimoineHeaderComponent,
        TransactionMasseComponent,
        QrModalComponent,
        TablebuttonHeaderComponent,
        SafePipe,
        FormatNumberPipe,
        TableFilterPipe,
        TableFilterPipe,
        ParginationComponent,
        FormMasseComponent,
        SpinnerComponent,
        CapitalizePipe,
        StatistiqueBoxComponent,
        TableTitleComponent,
        SpinnerTitleDetailsComponent,
        FormFolderComponent,
        SimDemandComponent,
        TableSimDemandComponent,
        FilterSimDemandComponent,
        FormDemandComponent,
        FormSimDemandComponent,
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
        SharedDataService,
        EndpointParamsService,
        TreatmentMonitoringApiService,
        HistoryApiService,
        PagesGuard,
        FormDemandApiService,
    ],
    exports: [
        AngularModule,
        PrimengModule,
        TranslateModule,
        InvoiceFormComponent,
        LoaderComponent,
        SearchTableComponent,
        StatBoxComponent,
        CountBoxComponent,
        BoxContainerComponent,
        BreadcrumbComponent,
        TraitementShowComponent,
        // TransactionShowComponent,
        HistoryComponent,
        FilterHistoryComponent,
        TableHistoryComponent,
        DetailsHistoryComponent,
        HistoriqueComponent,
        JournalComponent,
        QrModalComponent,
        TapToTopComponent,
        StatutContratComponent,
        TableHeaderComponent,
        TabViewHeaderComponent,
        PatrimoineHeaderComponent,
        TransactionMasseComponent,
        SvgIconComponent,
        SwiperModule,
        SafePipe,
        FormatNumberPipe,
        TableFilterPipe,
        TablebuttonHeaderComponent,
        ParginationComponent,
        FormMasseComponent,
        SpinnerComponent,
        CapitalizePipe,
        StatistiqueBoxComponent,
        TableTitleComponent,
        SpinnerTitleDetailsComponent,
        FormFolderComponent,
        SimDemandComponent,
        TableSimDemandComponent,
        FilterSimDemandComponent,
        FormDemandComponent,
        FormSimDemandComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
