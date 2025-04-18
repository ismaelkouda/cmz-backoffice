const Swal = require('sweetalert2');
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
import { StoreTokenService } from './store-token.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
    constructor(
        public router: Router,
        private toastrService: ToastrService,
        private loadingBar: LoadingBarService,
        private storage: EncodingDataService,
        private storeTokenService: StoreTokenService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // this.storeTokenService.removeToken();
        const token = this.storeTokenService.getToken;
        req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token?.value),
        });
        return next.handle(req).pipe(
            catchError((error) => {
                let handled: boolean = false;
                if (error instanceof HttpErrorResponse) {
                    if (error.error instanceof ErrorEvent) {
                    } else {
                        switch (error.status) {
                            case 401:
                                if (token) {
                                    handled = true;
                                    this.storage.removeData('user');
                                    this.storage.removeData('current_menu');
                                    this.storeTokenService.removeToken();
                                    this.router.navigateByUrl('auth/login');
                                    // .then(() => window.location.reload());
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
                                // Swal.fire({
                                //   backdrop: true,
                                //     icon: "error",
                                //     title: "Oops...",
                                //     text: "Un problème est survenu!",
                                //     footer: '<a href="#">Veuillez contacter l\'administrateur ?</a>'
                                //   });
                                break;
                            case 403:
                                handled = true;
                                // Swal.fire({
                                //     icon: "error",
                                //     title: "Oops...",
                                //     text: "Un problème est survenu!",
                                //     footer: '<a href="#">Veuillez contacter l\'administrateur ?</a>'
                                //   });
                                break;
                            case 404:
                                handled = true;
                                // Swal.fire({
                                //     confirmButtonColor: "#569C5B",
                                //     icon: "error",
                                //     title: "Oops...",
                                //     text: "Un problème est survenu!",
                                //     footer: '<a href="#">Veuillez contacter l\'administrateur ?</a>'
                                //   });
                                break;
                            case 422:
                                this.toastrService.error(
                                    `${error.error.message}`
                                );
                                // Swal.fire({
                                //     confirmButtonColor: "#569C5B",
                                //     icon: "error",
                                //     title: "Oops...",
                                //     text: "Un problème est survenu!",
                                //     footer: '<a href="#">Veuillez contacter l\'administrateur ?</a>'
                                //   });
                                handled = false;
                                break;
                            case 500:
                                // Swal.fire({
                                //     confirmButtonColor: "#569C5B",
                                //     icon: "error",
                                //     title: "Oops...",
                                //     text: "Un problème est survenu!",
                                //     footer: '<a href="#">Veuillez contacter l\'administrateur ?</a>'
                                //   });
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
