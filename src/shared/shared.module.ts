import { SharedDataService } from './services/shared-data.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormMasseComponent } from './components/form-masse/form-masse.component';
import { ParginationComponent } from 'src/shared/components/pargination/pargination.component';
import { TransactionMasseComponent } from './components/transaction-masse/transaction-masse.component';
import { PatrimoineHeaderComponent } from './components/patrimoine-header/patrimoine-header.component';
import { TabViewHeaderComponent } from './components/tab-view-header/tab-view-header.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { StatutContratComponent } from './components/statut-contrat/statut-contrat.component';
import { FormatNumberPipe } from './pipes/formatNumber.pipe';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { CountBoxComponent } from './components/count-box/count-box.component';
import { StatBoxComponent } from './components/stat-box/stat-box.component';
import { JournalComponent } from './components/journal/journal.component';
import { SafePipe } from './pipes/safe.pipe';
import { HistoriqueComponent } from './components/historique/historique.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core'; import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { NgxPaginationModule } from "ngx-pagination";
import { CapitalizePipe } from "./pipes/capitalize.pipe";

// Components
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { ContentComponent } from "./components/layout/content/content.component";
import { FullComponent } from "./components/layout/full/full.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TapToTopComponent } from "./components/tap-to-top/tap-to-top.component";
import { MyAccountComponent } from "./components/header/elements/my-account/my-account.component";
import { TablebuttonHeaderComponent } from "src/shared/components/table-button-header/table-button-header.component";

// Services
import { LayoutService } from "./services/layout.service";
import { NavService } from "./services/nav.service";
import { DecimalPipe } from "@angular/common";
import { SvgIconComponent } from "./components/svg-icon/svg-icon.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { SwiperModule } from "swiper/angular";

//Primeng Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableFilterPipe } from './pipes/table-filter.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { TraitementShowComponent } from './components/traitement-show/traitement-show.component';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    TraitementShowComponent,
    TransactionShowComponent,
    FullComponent,
    LoaderComponent,
    StatBoxComponent,
    CountBoxComponent,
    TapToTopComponent,
    MyAccountComponent,
    SvgIconComponent,
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
    CapitalizePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule.forRoot(),
    CarouselModule,
    SwiperModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    DialogModule,
    NgxPaginationModule,
    BadgeModule,
    RadioButtonModule,
    PasswordModule,
    PaginatorModule,
    ProgressSpinnerModule
  ],
  providers: [NavService, LayoutService, DecimalPipe, SharedDataService],
  exports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoaderComponent,
    StatBoxComponent,
    CountBoxComponent,
    BreadcrumbComponent,
    TraitementShowComponent,
    TransactionShowComponent,
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
    RadioButtonModule,
    FormMasseComponent,
    SpinnerComponent,
    ProgressSpinnerModule,
    CapitalizePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class SharedModule { }
