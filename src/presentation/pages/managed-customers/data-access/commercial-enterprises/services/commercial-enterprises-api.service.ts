import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';
import { EnvService } from '../../../../../../shared/services/env.service';
import { CommercialEnterprisesEndpointEnum } from '../enums/commercial-enterprises-endpoint.enum';
import { CommercialEnterprisesFilterInterface } from '../interfaces/commercial-enterprises-filter.interface';
import {
    CommercialEnterprisesApiResponseInterface,
    CommercialEnterprisesInterface,
    CommercialEnterprisesStatsInterface,
} from '../interfaces/commercial-enterprises.interface';

@Injectable()
export class CommercialEnterprisesApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour récupérer la liste sim-card*************** */
    private commercialEnterprisesSubject = new BehaviorSubject<
        CommercialEnterprisesInterface[]
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
        nbrPage = '1'
    ): void {
        if (this.loadingCommercialEnterprisesSubject.getValue()) {
            return;
        }
        this.loadingCommercialEnterprisesSubject.next(true);
        const url: string =
            CommercialEnterprisesEndpointEnum.CUSTOMERS_MANAGED_COMMERCIAL_ENTERPRISE.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<object>(this.BASE_URL + url, {
                ...data,
                type_entreprise: TYPE_CUSTOMERS_ENUM.COMMERCIAL_ENTERPRISE,
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

    getCommercialEnterprises(): Observable<CommercialEnterprisesInterface[]> {
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
