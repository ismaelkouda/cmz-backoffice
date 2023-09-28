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

// Components
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { ContentComponent } from "./components/layout/content/content.component";
import { FullComponent } from "./components/layout/full/full.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TapToTopComponent } from "./components/tap-to-top/tap-to-top.component";
// Header Elements Components
import { MyAccountComponent } from "./components/header/elements/my-account/my-account.component";

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
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableFilterPipe } from './pipes/table-filter.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    FullComponent,
    LoaderComponent,
    TapToTopComponent,
    MyAccountComponent,
    SvgIconComponent,
    HistoriqueComponent,
    JournalComponent,
    SafePipe,
    TableFilterPipe,
    TableFilterPipe
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
    NgxPaginationModule
  ],
  providers: [NavService, LayoutService, DecimalPipe],
  exports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoaderComponent,
    BreadcrumbComponent,
    HistoriqueComponent,
    JournalComponent,
    TapToTopComponent,
    SvgIconComponent,
    SwiperModule,
    SafePipe,
    TableFilterPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class SharedModule { }
