import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    myAccountApiResponseInterface,
    myAccountInterface,
} from '../interfaces/my-account.interface';
import { myAccountEndpointEnum } from '../enums/my-account-endpoint.enum';
import { myAccountFilterInterface } from '../interfaces/my-account-filter.interface';
import { BankInterface } from '../../../../../../shared/interfaces/bank.interface';
import { EndPointUrl } from '../../../../../../shared/enum/api.enum';

@Injectable()
export class MyAccountApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste my-account*************** */

    private myAccountSubject = new BehaviorSubject<Array<myAccountInterface>>(
        []
    );
    private myAccountPagination = new BehaviorSubject<
        Paginate<myAccountInterface>
    >({} as Paginate<myAccountInterface>);
    private myAccountSelected = new BehaviorSubject<myAccountInterface>(
        {} as myAccountInterface
    );
    private loadingMyAccountSubject = new BehaviorSubject<boolean>(false);
    private dataFilterMyAccountSubject =
        new BehaviorSubject<myAccountFilterInterface>(
            {} as myAccountFilterInterface
        );
    private dataNbrPageMyAccountSubject = new BehaviorSubject<string>('1');
    private apiResponseMyAccountSubject =
        new BehaviorSubject<myAccountApiResponseInterface>(
            {} as myAccountApiResponseInterface
        );

    fetchMyAccount(
        data: myAccountFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingMyAccountSubject.getValue()) return;
        this.loadingMyAccountSubject.next(true);
        const url: string =
            myAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const myAccount = response?.['data']?.data?.data;
                    this.myAccountSubject.next(myAccount);
                    this.myAccountPagination.next(response?.['data']?.data);
                    this.apiResponseMyAccountSubject.next(response);
                    this.dataFilterMyAccountSubject.next(data);
                    this.dataNbrPageMyAccountSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching my-account', error);
                    return of([]);
                }),
                finalize(() => this.loadingMyAccountSubject.next(false))
            )
            .subscribe();
    }

    getMyAccount(): Observable<Array<myAccountInterface>> {
        return this.myAccountSubject.asObservable();
    }
    getMyAccountPagination(): Observable<Paginate<myAccountInterface>> {
        return this.myAccountPagination.asObservable();
    }
    isLoadingMyAccount(): Observable<boolean> {
        return this.loadingMyAccountSubject.asObservable();
    }
    getDataFilterMyAccount(): Observable<myAccountFilterInterface> {
        return this.dataFilterMyAccountSubject.asObservable();
    }
    getDataNbrPageMyAccount(): Observable<string> {
        return this.dataNbrPageMyAccountSubject.asObservable();
    }
    getApiResponseMyAccount(): Observable<myAccountApiResponseInterface> {
        return this.apiResponseMyAccountSubject.asObservable();
    }
    getMyAccountSelected(): Observable<myAccountInterface> {
        return this.myAccountSelected.asObservable();
    }
    setMyAccountSelected(myAccount: myAccountInterface): void {
        this.myAccountSelected.next(myAccount);
    }
}
