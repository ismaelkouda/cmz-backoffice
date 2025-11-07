import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { EnvService } from '../../../../../../shared/services/env.service';
import { CustomersEndpointEnum } from '../enums/customers-endpoint.enum';
import { CustomersFilterInterface } from '../interfaces/customers-filter.interface';
import {
    CustomersApiResponseInterface,
    CustomersInterface,
    CustomersStatsInterface,
} from '../interfaces/customers.interface';

@Injectable()
export class CustomersApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    private individualsSubject = new BehaviorSubject<Array<CustomersInterface>>(
        []
    );
    private individualsStatsSubject =
        new BehaviorSubject<CustomersStatsInterface>(
            {} as CustomersStatsInterface
        );
    private individualsPagination = new BehaviorSubject<
        Paginate<CustomersInterface>
    >({} as Paginate<CustomersInterface>);
    private loadingCustomersSubject = new BehaviorSubject<boolean>(false);
    private dataFilterCustomersSubject =
        new BehaviorSubject<CustomersFilterInterface>(
            {} as CustomersFilterInterface
        );
    private dataNbrPageCustomersSubject = new BehaviorSubject<string>('1');
    private apiResponseCustomersSubject =
        new BehaviorSubject<CustomersApiResponseInterface>(
            {} as CustomersApiResponseInterface
        );
    fetchCustomers(
        data: CustomersFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingCustomersSubject.getValue()) return;
        this.loadingCustomersSubject.next(true);
        const url: string =
            CustomersEndpointEnum.CUSTOMERS_MANAGED_CUSTOMERS.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, {
                ...data,
                type_entreprise: TYPE_CUSTOMERS_ENUM.INDIVIDUALS,
            })
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const individuals = response?.['data']?.data;
                    this.individualsSubject.next(individuals);
                    this.individualsPagination.next(response?.['data']);
                    this.individualsStatsSubject.next(response);
                    this.apiResponseCustomersSubject.next(response);
                    this.dataFilterCustomersSubject.next(data);
                    this.dataNbrPageCustomersSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingCustomersSubject.next(false))
            )
            .subscribe();
    }

    getCustomers(): Observable<Array<CustomersInterface>> {
        return this.individualsSubject.asObservable();
    }
    getCustomersPagination(): Observable<Paginate<CustomersInterface>> {
        return this.individualsPagination.asObservable();
    }
    isLoadingCustomers(): Observable<boolean> {
        return this.loadingCustomersSubject.asObservable();
    }
    getDataFilterCustomers(): Observable<CustomersFilterInterface> {
        return this.dataFilterCustomersSubject.asObservable();
    }
    getDataNbrPageCustomers(): Observable<string> {
        return this.dataNbrPageCustomersSubject.asObservable();
    }
    getApiResponseCustomers(): Observable<CustomersApiResponseInterface> {
        return this.apiResponseCustomersSubject.asObservable();
    }
    getCustomersStats(): Observable<CustomersStatsInterface> {
        return this.individualsStatsSubject.asObservable();
    }
}
