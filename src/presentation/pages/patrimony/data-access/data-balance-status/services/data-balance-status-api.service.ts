import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    dataBalanceStatusApiResponseInterface,
    dataBalanceStatusInterface,
} from '../interfaces/data-balance-status.interface';
import { dataBalanceStatusEndpointEnum } from '../enums/data-balance-status-endpoint.enum';
import { dataBalanceStatusFilterInterface } from '../interfaces/data-balance-status-filter.interface';

@Injectable()
export class dataBalanceStatusApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste data-balance-status*************** */

    private dataBalanceStatusSubject = new BehaviorSubject<
        Array<dataBalanceStatusInterface>
    >([]);
    private dataBalanceStatusPagination = new BehaviorSubject<
        Paginate<dataBalanceStatusInterface>
    >({} as Paginate<dataBalanceStatusInterface>);
    private dataBalanceStatusSelected =
        new BehaviorSubject<dataBalanceStatusInterface>(
            {} as dataBalanceStatusInterface
        );
    private loadingDataBalanceStatusSubject = new BehaviorSubject<boolean>(
        false
    );
    private dataFilterDataBalanceStatusSubject =
        new BehaviorSubject<dataBalanceStatusFilterInterface>(
            {} as dataBalanceStatusFilterInterface
        );
    private dataNbrPageDataBalanceStatusSubject = new BehaviorSubject<string>(
        '1'
    );
    private apiResponseDataBalanceStatusSubject =
        new BehaviorSubject<dataBalanceStatusApiResponseInterface>(
            {} as dataBalanceStatusApiResponseInterface
        );

    fetchDataBalanceStatus(
        data: dataBalanceStatusFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingDataBalanceStatusSubject.getValue()) return;
        this.loadingDataBalanceStatusSubject.next(true);
        const url: string =
            dataBalanceStatusEndpointEnum.PATRIMONY_SIM_SIMS_ALL_PAGE.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const dataBalanceStatus = response?.['data']?.data;
                    this.dataBalanceStatusSubject.next(dataBalanceStatus);
                    this.dataBalanceStatusPagination.next(response?.['data']);
                    this.apiResponseDataBalanceStatusSubject.next(response);
                    this.dataFilterDataBalanceStatusSubject.next(data);
                    this.dataNbrPageDataBalanceStatusSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching data-balance-status', error);
                    return of([]);
                }),
                finalize(() => this.loadingDataBalanceStatusSubject.next(false))
            )
            .subscribe();
    }

    getDataBalanceStatus(): Observable<Array<dataBalanceStatusInterface>> {
        return this.dataBalanceStatusSubject.asObservable();
    }
    getDataBalanceStatusPagination(): Observable<
        Paginate<dataBalanceStatusInterface>
    > {
        return this.dataBalanceStatusPagination.asObservable();
    }
    isLoadingDataBalanceStatus(): Observable<boolean> {
        return this.loadingDataBalanceStatusSubject.asObservable();
    }
    getDataFilterDataBalanceStatus(): Observable<dataBalanceStatusFilterInterface> {
        return this.dataFilterDataBalanceStatusSubject.asObservable();
    }
    getDataNbrPageDataBalanceStatus(): Observable<string> {
        return this.dataNbrPageDataBalanceStatusSubject.asObservable();
    }
    getApiResponseDataBalanceStatus(): Observable<dataBalanceStatusApiResponseInterface> {
        return this.apiResponseDataBalanceStatusSubject.asObservable();
    }
    getDataBalanceStatusSelected(): Observable<dataBalanceStatusInterface> {
        return this.dataBalanceStatusSelected.asObservable();
    }
    setDataBalanceStatusSelected(
        dataBalanceStatus: dataBalanceStatusInterface
    ): void {
        this.dataBalanceStatusSelected.next(dataBalanceStatus);
    }
}
