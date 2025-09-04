import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { ManagedCustomersDetailsInterface } from '../interfaces/managed-customers-details.interface';
import { ManagedCustomersDetailsEndpointEnum } from '../enums/managed-customers-details-endpoint.enum';

@Injectable()
export class ManagedCustomersApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
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
            ManagedCustomersDetailsEndpointEnum.MANAGED_CUSTOMERS_DETAILS.replace(
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
