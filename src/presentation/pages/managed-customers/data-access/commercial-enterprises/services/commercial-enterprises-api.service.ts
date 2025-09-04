import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import {
    CommercialEnterprisesApiResponseInterface,
    CommercialEnterprisesInterface,
    CommercialEnterprisesStatsInterface,
} from '../interfaces/commercial-enterprises.interface';
import { CommercialEnterprisesEndpointEnum } from '../enums/commercial-enterprises-endpoint.enum';
import { CommercialEnterprisesFilterInterface } from '../interfaces/commercial-enterprises-filter.interface';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';

@Injectable()
export class CommercialEnterprisesApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste sim-card*************** */
    private commercialEnterprisesSubject = new BehaviorSubject<
        Array<CommercialEnterprisesInterface>
    >([]);
    private commercialEnterprisesStatsSubject =
        new BehaviorSubject<CommercialEnterprisesStatsInterface>(
            {} as CommercialEnterprisesStatsInterface
        );
    private commercialEnterprisesPagination = new BehaviorSubject<
        Paginate<CommercialEnterprisesInterface>
    >({} as Paginate<CommercialEnterprisesInterface>);
    private loadingCommercialEnterprisesSubject = new BehaviorSubject<boolean>(
        false
    );
    private dataFilterCommercialEnterprisesSubject =
        new BehaviorSubject<CommercialEnterprisesFilterInterface>(
            {} as CommercialEnterprisesFilterInterface
        );
    private dataNbrPageCommercialEnterprisesSubject =
        new BehaviorSubject<string>('1');
    private apiResponseCommercialEnterprisesSubject =
        new BehaviorSubject<CommercialEnterprisesApiResponseInterface>(
            {} as CommercialEnterprisesApiResponseInterface
        );

    fetchCommercialEnterprises(
        data: CommercialEnterprisesFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingCommercialEnterprisesSubject.getValue()) return;
        this.loadingCommercialEnterprisesSubject.next(true);
        const url: string =
            CommercialEnterprisesEndpointEnum.MANAGED_CUSTOMERS_COMMERCIAL_ENTERPRISES.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, {
                ...data,
                type_entreprise: TYPE_CUSTOMERS_ENUM.COMMERCIAL_ENTERPRISES,
            })
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const commercialEnterprises = response?.['data']?.data;
                    this.commercialEnterprisesSubject.next(
                        commercialEnterprises
                    );
                    this.commercialEnterprisesPagination.next(
                        response?.['data']
                    );
                    this.commercialEnterprisesStatsSubject.next(response);
                    this.apiResponseCommercialEnterprisesSubject.next(response);
                    this.dataFilterCommercialEnterprisesSubject.next(data);
                    this.dataNbrPageCommercialEnterprisesSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingCommercialEnterprisesSubject.next(false)
                )
            )
            .subscribe();
    }

    getCommercialEnterprises(): Observable<
        Array<CommercialEnterprisesInterface>
    > {
        return this.commercialEnterprisesSubject.asObservable();
    }
    getCommercialEnterprisesPagination(): Observable<
        Paginate<CommercialEnterprisesInterface>
    > {
        return this.commercialEnterprisesPagination.asObservable();
    }
    isLoadingCommercialEnterprises(): Observable<boolean> {
        return this.loadingCommercialEnterprisesSubject.asObservable();
    }
    getDataFilterCommercialEnterprises(): Observable<CommercialEnterprisesFilterInterface> {
        return this.dataFilterCommercialEnterprisesSubject.asObservable();
    }
    getDataNbrPageCommercialEnterprises(): Observable<string> {
        return this.dataNbrPageCommercialEnterprisesSubject.asObservable();
    }
    getApiResponseCommercialEnterprises(): Observable<CommercialEnterprisesApiResponseInterface> {
        return this.apiResponseCommercialEnterprisesSubject.asObservable();
    }
    getCommercialEnterprisesStats(): Observable<CommercialEnterprisesStatsInterface> {
        return this.commercialEnterprisesStatsSubject.asObservable();
    }
}
