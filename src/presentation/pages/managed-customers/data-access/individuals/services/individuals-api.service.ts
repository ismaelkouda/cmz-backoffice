import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import {
    IndividualsApiResponseInterface,
    IndividualsInterface,
    IndividualsStatsInterface,
} from '../interfaces/individuals.interface';
import { IndividualsEndpointEnum } from '../enums/individuals-endpoint.enum';
import { IndividualsFilterInterface } from '../interfaces/individuals-filter.interface';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';

@Injectable()
export class IndividualsApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    private individualsSubject = new BehaviorSubject<
        Array<IndividualsInterface>
    >([]);
    private individualsStatsSubject =
        new BehaviorSubject<IndividualsStatsInterface>(
            {} as IndividualsStatsInterface
        );
    private individualsPagination = new BehaviorSubject<
        Paginate<IndividualsInterface>
    >({} as Paginate<IndividualsInterface>);
    private loadingIndividualsSubject = new BehaviorSubject<boolean>(false);
    private dataFilterIndividualsSubject =
        new BehaviorSubject<IndividualsFilterInterface>(
            {} as IndividualsFilterInterface
        );
    private dataNbrPageIndividualsSubject = new BehaviorSubject<string>('1');
    private apiResponseIndividualsSubject =
        new BehaviorSubject<IndividualsApiResponseInterface>(
            {} as IndividualsApiResponseInterface
        );
    fetchIndividuals(
        data: IndividualsFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingIndividualsSubject.getValue()) return;
        this.loadingIndividualsSubject.next(true);
        const url: string =
            IndividualsEndpointEnum.MANAGED_CUSTOMERS_INDIVIDUALS.replace(
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
                    this.apiResponseIndividualsSubject.next(response);
                    this.dataFilterIndividualsSubject.next(data);
                    this.dataNbrPageIndividualsSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingIndividualsSubject.next(false))
            )
            .subscribe();
    }

    getIndividuals(): Observable<Array<IndividualsInterface>> {
        return this.individualsSubject.asObservable();
    }
    getIndividualsPagination(): Observable<Paginate<IndividualsInterface>> {
        return this.individualsPagination.asObservable();
    }
    isLoadingIndividuals(): Observable<boolean> {
        return this.loadingIndividualsSubject.asObservable();
    }
    getDataFilterIndividuals(): Observable<IndividualsFilterInterface> {
        return this.dataFilterIndividualsSubject.asObservable();
    }
    getDataNbrPageIndividuals(): Observable<string> {
        return this.dataNbrPageIndividualsSubject.asObservable();
    }
    getApiResponseIndividuals(): Observable<IndividualsApiResponseInterface> {
        return this.apiResponseIndividualsSubject.asObservable();
    }
    getIndividualsStats(): Observable<IndividualsStatsInterface> {
        return this.individualsStatsSubject.asObservable();
    }
}
