import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { EnvService } from '../../../../../../shared/services/env.service';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { CustomersActivateFilterInterface } from '../../customers-activate/interfaces/customers-activate-filter.interface';
import { RequestsServiceEndpointEnum } from '../enums/requests-service-endpoint.enum';

@Injectable()
export class RequestsServiceApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService,
        private sharedService: SharedService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour valider une creation de client *************** */

    private createCustomersActivateSubject = new BehaviorSubject<any>(
        {} as any
    );
    private loadingCreateCustomersActivateSubject =
        new BehaviorSubject<boolean>(false);

    fetchCreateCustomersActivate(
        data: any,
        toastService: ToastrService,
        goOut?: () => void
    ): void {
        if (this.loadingCreateCustomersActivateSubject.getValue()) return;
        this.loadingCreateCustomersActivateSubject.next(true);
        const url: string = RequestsServiceEndpointEnum.REQUESTS_SERVICE_STORE;
        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const createCustomersActivate = response;
                    this.createCustomersActivateSubject.next(
                        createCustomersActivate
                    );
                    this.handleSuccessFullFetch(response, toastService, goOut);
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching createCustomersActivate',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingCreateCustomersActivateSubject.next(false)
                )
            )
            .subscribe();
    }

    getCreateCustomersActivate(): Observable<any> {
        return this.createCustomersActivateSubject.asObservable();
    }
    isLoadingCreateCustomersActivate(): Observable<boolean> {
        return this.loadingCreateCustomersActivateSubject.asObservable();
    }

    handleSuccessFullFetch(
        response: any,
        toastService: ToastrService,
        goOut?: () => void
    ) {
        if (response && response.error === false && toastService) {
            toastService.success(response.message);
            if (goOut) {
                goOut();
            }
            this.sharedService.fetchCustomersActivate(
                {} as CustomersActivateFilterInterface
            );
        } else if (response && response.error === true) {
            toastService.error(response.message);
        }
    }
}
