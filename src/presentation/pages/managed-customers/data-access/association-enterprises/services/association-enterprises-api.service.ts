import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import {
    AssociationEnterprisesApiResponseInterface,
    AssociationEnterprisesInterface,
    AssociationEnterprisesStatsInterface,
} from '../interfaces/association-enterprises.interface';
import { AssociationEnterprisesEndpointEnum } from '../enums/association-enterprises-endpoint.enum';
import { AssociationEnterprisesFilterInterface } from '../interfaces/association-enterprises-filter.interface';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';

@Injectable()
export class AssociationEnterprisesApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    private associationEnterprisesSubject = new BehaviorSubject<
        Array<AssociationEnterprisesInterface>
    >([]);
    private associationEnterprisesStatsSubject =
        new BehaviorSubject<AssociationEnterprisesStatsInterface>(
            {} as AssociationEnterprisesStatsInterface
        );
    private associationEnterprisesPagination = new BehaviorSubject<
        Paginate<AssociationEnterprisesInterface>
    >({} as Paginate<AssociationEnterprisesInterface>);
    private loadingAssociationEnterprisesSubject = new BehaviorSubject<boolean>(
        false
    );
    private dataFilterAssociationEnterprisesSubject =
        new BehaviorSubject<AssociationEnterprisesFilterInterface>(
            {} as AssociationEnterprisesFilterInterface
        );
    private dataNbrPageAssociationEnterprisesSubject =
        new BehaviorSubject<string>('1');
    private apiResponseAssociationEnterprisesSubject =
        new BehaviorSubject<AssociationEnterprisesApiResponseInterface>(
            {} as AssociationEnterprisesApiResponseInterface
        );
    fetchAssociationEnterprises(
        data: AssociationEnterprisesFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingAssociationEnterprisesSubject.getValue()) return;
        this.loadingAssociationEnterprisesSubject.next(true);
        const url: string =
            AssociationEnterprisesEndpointEnum.MANAGED_CUSTOMERS_ASSOCIATION_ENTERPRISES.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, {
                ...data,
                type_entreprise: TYPE_CUSTOMERS_ENUM.ASSOCIATION_ENTERPRISES,
            })
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const associationEnterprises = response?.['data']?.data;
                    this.associationEnterprisesSubject.next(
                        associationEnterprises
                    );
                    this.associationEnterprisesPagination.next(
                        response?.['data']
                    );
                    this.associationEnterprisesStatsSubject.next(response);
                    this.apiResponseAssociationEnterprisesSubject.next(
                        response
                    );
                    this.dataFilterAssociationEnterprisesSubject.next(data);
                    this.dataNbrPageAssociationEnterprisesSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingAssociationEnterprisesSubject.next(false)
                )
            )
            .subscribe();
    }

    getAssociationEnterprises(): Observable<
        Array<AssociationEnterprisesInterface>
    > {
        return this.associationEnterprisesSubject.asObservable();
    }
    getAssociationEnterprisesPagination(): Observable<
        Paginate<AssociationEnterprisesInterface>
    > {
        return this.associationEnterprisesPagination.asObservable();
    }
    isLoadingAssociationEnterprises(): Observable<boolean> {
        return this.loadingAssociationEnterprisesSubject.asObservable();
    }
    getDataFilterAssociationEnterprises(): Observable<AssociationEnterprisesFilterInterface> {
        return this.dataFilterAssociationEnterprisesSubject.asObservable();
    }
    getDataNbrPageAssociationEnterprises(): Observable<string> {
        return this.dataNbrPageAssociationEnterprisesSubject.asObservable();
    }
    getApiResponseAssociationEnterprises(): Observable<AssociationEnterprisesApiResponseInterface> {
        return this.apiResponseAssociationEnterprisesSubject.asObservable();
    }
    getAssociationEnterprisesStats(): Observable<AssociationEnterprisesStatsInterface> {
        return this.associationEnterprisesStatsSubject.asObservable();
    }
}
