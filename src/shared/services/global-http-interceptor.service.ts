import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EncodingDataService } from './encoding-data.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
    constructor(
        public router: Router,
        private toastrService: ToastrService,
        private loadingBar: LoadingBarService,
        private storage: EncodingDataService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let data;
        const user: any = this.storage.getData('token');
        user ? (data = JSON.parse(this.storage.getData('token'))) : (data = {});
        req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + data.value),
        });
        return next.handle(req).pipe(
            catchError((error) => {
                let handled: boolean = false;
                if (error instanceof HttpErrorResponse) {
                    if (error.error instanceof ErrorEvent) {
                    } else {
                        switch (error.status) {
                            case 401:
                                if (data) {
                                    handled = true;
                                    this.storage.removeData('user');
                                    this.storage.removeData('current_menu');
                                    this.router
                                        .navigateByUrl('auth/login')
                                        .then(() => window.location.reload());
                                } else {
                                    this.loadingBar.stop();
                                    this.toastrService.error(
                                        `${error.error.message}`
                                    );
                                }
                                break;
                            case 201:
                                handled = true;
                                this.router.navigateByUrl(`/auth/login`);

                                break;
                            case 403:
                                handled = true;
                                break;
                            case 404:
                                handled = true;
                                break;
                            case 422:
                                this.loadingBar.stop();
                                handled = false;
                                break;
                            case 500:
                                handled = false;
                                break;
                        }
                    }
                } else {
                }
                if (handled) {
                    return of(error);
                } else {
                    return throwError(error);
                }
            })
        );
    }
}
