import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import {
    PublicEnterprisesApiResponseInterface,
    PublicEnterprisesInterface,
    PublicEnterprisesStatsInterface,
} from '../interfaces/public-enterprises.interface';
import { PublicEnterprisesEndpointEnum } from '../enums/public-enterprises-endpoint.enum';
import { PublicEnterprisesFilterInterface } from '../interfaces/public-enterprises-filter.interface';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';

@Injectable()
export class PublicEnterprisesApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    private publicEnterprisesSubject = new BehaviorSubject<
        Array<PublicEnterprisesInterface>
    >([]);
    private publicEnterprisesStatsSubject =
        new BehaviorSubject<PublicEnterprisesStatsInterface>(
            {} as PublicEnterprisesStatsInterface
        );
    private publicEnterprisesPagination = new BehaviorSubject<
        Paginate<PublicEnterprisesInterface>
    >({} as Paginate<PublicEnterprisesInterface>);
    private loadingPublicEnterprisesSubject = new BehaviorSubject<boolean>(
        false
    );
    private dataFilterPublicEnterprisesSubject =
        new BehaviorSubject<PublicEnterprisesFilterInterface>(
            {} as PublicEnterprisesFilterInterface
        );
    private dataNbrPagePublicEnterprisesSubject = new BehaviorSubject<string>(
        '1'
    );
    private apiResponsePublicEnterprisesSubject =
        new BehaviorSubject<PublicEnterprisesApiResponseInterface>(
            {} as PublicEnterprisesApiResponseInterface
        );
    fetchPublicEnterprises(
        data: PublicEnterprisesFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingPublicEnterprisesSubject.getValue()) return;
        this.loadingPublicEnterprisesSubject.next(true);
        const url: string =
            PublicEnterprisesEndpointEnum.MANAGED_CUSTOMERS_PUBLIC_ENTERPRISES.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, {
                ...data,
                type_entreprise: TYPE_CUSTOMERS_ENUM.PUBLIC_ENTERPRISES,
            })
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const publicEnterprises = response?.['data']?.data;
                    this.publicEnterprisesSubject.next(publicEnterprises);
                    this.publicEnterprisesPagination.next(response?.['data']);
                    this.publicEnterprisesStatsSubject.next(response);
                    this.apiResponsePublicEnterprisesSubject.next(response);
                    this.dataFilterPublicEnterprisesSubject.next(data);
                    this.dataNbrPagePublicEnterprisesSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingPublicEnterprisesSubject.next(false))
            )
            .subscribe();
    }

    getPublicEnterprises(): Observable<Array<PublicEnterprisesInterface>> {
        return this.publicEnterprisesSubject.asObservable();
    }
    getPublicEnterprisesPagination(): Observable<
        Paginate<PublicEnterprisesInterface>
    > {
        return this.publicEnterprisesPagination.asObservable();
    }
    isLoadingPublicEnterprises(): Observable<boolean> {
        return this.loadingPublicEnterprisesSubject.asObservable();
    }
    getDataFilterPublicEnterprises(): Observable<PublicEnterprisesFilterInterface> {
        return this.dataFilterPublicEnterprisesSubject.asObservable();
    }
    getDataNbrPagePublicEnterprises(): Observable<string> {
        return this.dataNbrPagePublicEnterprisesSubject.asObservable();
    }
    getApiResponsePublicEnterprises(): Observable<PublicEnterprisesApiResponseInterface> {
        return this.apiResponsePublicEnterprisesSubject.asObservable();
    }
    getPublicEnterprisesStats(): Observable<PublicEnterprisesStatsInterface> {
        return this.publicEnterprisesStatsSubject.asObservable();
    }
}
