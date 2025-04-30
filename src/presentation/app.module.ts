import { GlobalHttpInterceptorService } from './../shared/services/global-http-interceptor.service';
import { SharedModule } from './../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
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
import { WebSocketSubject } from 'rxjs/webSocket';
// import { EnvServiceProvider } from '../shared/services/env.service.provider';
import { NotifyService } from '../shared/services/notify.service';
import { AuthGuard } from '../core/guard/auth.guard';
import { GuestGuard } from '../core/guard/guest.guard';
import { EnvService } from '../shared/services/env.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function initEnv(envService: EnvService): () => void {
    return () => envService.load();
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        OverlayModule,
        SharedModule,
        AppRoutingModule,
        // HttpClientModule,
        NgbModule,
        SupervisionOperationsModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        //For HttpClient use:
        LoadingBarHttpClientModule,
        //For Router use:
        LoadingBarRouterModule,
        //For Core use:
        LoadingBarModule,
    ],
    providers: [
        AuthGuard,
        GuestGuard,
        // EnvServiceProvider,
        LocalStorageService,
        NotifyService,
        {
            provide: WebSocketSubject,
            useFactory: initEnv,
            deps: [EnvService],
        },
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalHttpInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
