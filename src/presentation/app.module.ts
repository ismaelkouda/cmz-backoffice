import { GlobalHttpInterceptorService } from './../shared/services/global-http-interceptor.service';
import { SharedModule } from './../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppRoutingModule } from './app-routing.module';
import { LocalStorageService } from 'ngx-webstorage';
import { SupervisionOperationsModule } from './pages/supervision-operations/supervision-operations.module';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { NotifyService } from 'src/shared/services/notify.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { EnvServiceProvider } from '../shared/services/env.service.provider';
import { FileUploadModule } from 'primeng/fileupload';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OverlayModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FileUploadModule,
    SupervisionOperationsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    //For HttpClient use:
    LoadingBarHttpClientModule,
    //For Router use:
    LoadingBarRouterModule,
    //For Core use:
    LoadingBarModule
  ],
  providers: [
    EnvServiceProvider,
    LocalStorageService,
    NotifyService,
    { 
      provide: WebSocketSubject, 
      useFactory: (mappingService: MappingService) => webSocket(`${mappingService.ws_server}/ws/refrresh-notifs`),
      deps: [MappingService]
    },
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true },
    // { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
