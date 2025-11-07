import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { EnvService } from '../../../../../../shared/services/env.service';
import { ManagedCustomersDetailsEndpointEnum } from '../enums/managed-customers-details-endpoint.enum';
import { ManagedCustomersDetailsInterface } from '../interfaces/managed-customers-details.interface';

@Injectable()
export class ManagedCustomersApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour récupérer la liste sim-card*************** */
    private customersDetailsSubject =
        new BehaviorSubject<ManagedCustomersDetailsInterface>(
            {} as ManagedCustomersDetailsInterface
        );
    private loadingCustomersDetailsSubject = new BehaviorSubject<boolean>(
        false
    );
    fetchCustomersDetails(codeClient: string): void {
        if (this.loadingCustomersDetailsSubject.getValue()) return;
        this.loadingCustomersDetailsSubject.next(true);
        const url: string =
            ManagedCustomersDetailsEndpointEnum.CUSTOMERS_MANAGED_DETAILS.replace(
                '{codeClient}',
                codeClient
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const customersDetails = response?.['data'];
                    this.customersDetailsSubject.next(customersDetails);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingCustomersDetailsSubject.next(false))
            )
            .subscribe();
    }

    getCustomersDetails(): Observable<ManagedCustomersDetailsInterface> {
        return this.customersDetailsSubject.asObservable();
    }
    isLoadingCustomersDetails(): Observable<boolean> {
        return this.loadingCustomersDetailsSubject.asObservable();
    }
}
