import { ReloadAccountOperationDetailsInterface } from './../interfaces/transaction-details.interface';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { reloadMyAccountApiResponseInterface, reloadMyAccountGlobalStateInterface, reloadMyAccountInterface } from '../interfaces/reload-my-account.interface';
import { reloadMyAccountEndpointEnum } from '../enums/reload-my-account-endpoint.enum';
import { reloadMyAccountFilterInterface } from '../interfaces/reload-my-account-filter.interface';

@Injectable()

export class ReloadMyAccountApiService {

    private BASE_URL: string;

    constructor(private httpClient: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste reload-my-account*************** */

    private reloadMyAccountSubject = new BehaviorSubject<Array<reloadMyAccountInterface>>([]);
    private reloadMyAccountGlobalState = new BehaviorSubject<reloadMyAccountGlobalStateInterface>({} as reloadMyAccountGlobalStateInterface);
    private reloadMyAccountPagination = new BehaviorSubject<Paginate<reloadMyAccountInterface>>({} as Paginate<reloadMyAccountInterface>);
    private reloadMyAccountSelected = new BehaviorSubject<reloadMyAccountInterface>({} as reloadMyAccountInterface);
    private loadingReloadMyAccountSubject = new BehaviorSubject<boolean>(false);
    private dataFilterReloadMyAccountSubject = new BehaviorSubject<reloadMyAccountFilterInterface>({} as reloadMyAccountFilterInterface);
    private dataNbrPageReloadMyAccountSubject = new BehaviorSubject<string>('1');
    private apiResponseReloadMyAccountSubject = new BehaviorSubject<reloadMyAccountApiResponseInterface>({} as reloadMyAccountApiResponseInterface);

    fetchReloadMyAccount(data: reloadMyAccountFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingReloadMyAccountSubject.getValue()) return; // Évite les doublons pendant que l'api est en cours
        this.loadingReloadMyAccountSubject.next(true);
        const url: string = reloadMyAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS.replace('{page}', nbrPage);

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const reloadMyAccount = response?.['data']?.data?.data;
                    console.log('reloadMyAccount', reloadMyAccount)
                    this.reloadMyAccountSubject.next(reloadMyAccount);
                    this.reloadMyAccountPagination.next(response?.['data']?.data);
                    this.reloadMyAccountGlobalState.next(response?.['data']);
                    this.apiResponseReloadMyAccountSubject.next(response);
                    this.dataFilterReloadMyAccountSubject.next(data);
                    this.dataNbrPageReloadMyAccountSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching reload-my-account', error);
                    return of([]);
                }),
                finalize(() => this.loadingReloadMyAccountSubject.next(false))
            )
            .subscribe();
    }

    getReloadMyAccount(): Observable<Array<reloadMyAccountInterface>> {
        return this.reloadMyAccountSubject.asObservable();
    }
    getReloadMyAccountPagination(): Observable<Paginate<reloadMyAccountInterface>> {
        return this.reloadMyAccountPagination.asObservable();
    }
    getReloadMyAccountGlobalState(): Observable<reloadMyAccountGlobalStateInterface> {
        return this.reloadMyAccountGlobalState.asObservable();
    }
    isLoadingReloadMyAccount(): Observable<boolean> {
        return this.loadingReloadMyAccountSubject.asObservable();
    }
    getDataFilterReloadMyAccount(): Observable<reloadMyAccountFilterInterface> {
        return this.dataFilterReloadMyAccountSubject.asObservable();
    }
    getDataNbrPageReloadMyAccount(): Observable<string> {
        return this.dataNbrPageReloadMyAccountSubject.asObservable();
    }
    getApiResponseReloadMyAccount(): Observable<reloadMyAccountApiResponseInterface> {
        return this.apiResponseReloadMyAccountSubject.asObservable();
    }
    getReloadMyAccountSelected(): Observable<reloadMyAccountInterface> {
        return this.reloadMyAccountSelected.asObservable();
    }
    setReloadMyAccountSelected(reloadMyAccount: reloadMyAccountInterface): void {
        this.reloadMyAccountSelected.next(reloadMyAccount);
    }


    /*********************Méthode pour récupérer les details de la transaction*************** */

    private transactionDetailsSubject = new BehaviorSubject<ReloadAccountOperationDetailsInterface>({} as ReloadAccountOperationDetailsInterface);
    private loadingTransactionDetailsSubject = new BehaviorSubject<boolean>(false);

    fetchTransactionDetails(transaction: string): void {
        if (this.loadingTransactionDetailsSubject.getValue()) return; // Évite les doublons pendant que l'api est en cours
        this.loadingTransactionDetailsSubject.next(true);
        const url: string = reloadMyAccountEndpointEnum.ACCOUNT_CREDIT_transaction_Details.replace('{transaction}', transaction);

        this.httpClient
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const transactionDetails = response?.['data'];
                    this.transactionDetailsSubject.next(transactionDetails);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching reload-my-account', error);
                    return of([]);
                }),
                finalize(() => this.loadingTransactionDetailsSubject.next(false))
            )
            .subscribe();
    }

    getTransactionDetails(): Observable<ReloadAccountOperationDetailsInterface> {
        return this.transactionDetailsSubject.asObservable();
    }
    isLoadingTransactionDetails(): Observable<boolean> {
        return this.loadingTransactionDetailsSubject.asObservable();
    }


    // creditReloadMyAccount(data): Observable<any> {
    //     const url: string = <string>reloadMyAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS_STORE;
    //     return this.httpClient.post(`${this.BASE_URL}${url}`, data);
    // }
    /*********************Méthode pour enregistrer une demande de credit*************** */

    private demandCreditSubject = new BehaviorSubject<any>({} as any);
    private loadingDemandCreditSubject = new BehaviorSubject<boolean>(false);

    fetchDemandCredit(data: any): void {
        if (this.loadingDemandCreditSubject.getValue()) return;
        this.loadingDemandCreditSubject.next(true);
        const url: string = reloadMyAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS_STORE;

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const demandCredit = response;
                    this.demandCreditSubject.next(demandCredit);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching reload-my-account', error);
                    return of([]);
                }),
                finalize(() => this.loadingDemandCreditSubject.next(false))
            )
            .subscribe();
    }

    getDemandCredit(): Observable<any> {
        return this.demandCreditSubject.asObservable();
    }
    isLoadingDemandCredit(): Observable<boolean> {
        return this.loadingTransactionDetailsSubject.asObservable();
    }

    /*********************Méthode pour modifier une demande de credit*************** */

    private updateDemandCreditSubject = new BehaviorSubject<any>({} as any);
    private loadingUpdateDemandCreditSubject = new BehaviorSubject<boolean>(false);

    fetchUpdateDemandCredit(data: any): void {
        if (this.loadingUpdateDemandCreditSubject.getValue()) return;
        this.loadingUpdateDemandCreditSubject.next(true);
        const url: string = reloadMyAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS_UPDATE;

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const updatedemandCredit = response;
                    console.log("updatedemandCredit", updatedemandCredit);

                    this.updateDemandCreditSubject.next(updatedemandCredit);
                    console.log("updatedemandCredit", updatedemandCredit);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching reload-my-account', error);
                    return of([]);
                }),
                finalize(() => this.loadingUpdateDemandCreditSubject.next(false))
            )
            .subscribe();
    }

    getUpdateDemandCredit(): Observable<any> {
        return this.updateDemandCreditSubject.asObservable();
    }
    isLoadingUpdateDemandCredit(): Observable<boolean> {
        return this.loadingTransactionDetailsSubject.asObservable();
    }

    /*********************Méthode pour abandonner une demande de credit*************** */

    private letDownCreditSubject = new BehaviorSubject<any>({} as any);
    private loadingLetDownCreditSubject = new BehaviorSubject<boolean>(false);

    fetchLetDownCredit(data: any): void {
        if (this.loadingLetDownCreditSubject.getValue()) return;
        this.loadingLetDownCreditSubject.next(true);
        const url: string = reloadMyAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS_LETDOWN;

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const demandCredit = response;

                    this.letDownCreditSubject.next(demandCredit);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching reload-my-account', error);
                    return of([]);
                }),
                finalize(() => this.loadingLetDownCreditSubject.next(false))
            )
            .subscribe();
    }

    getLetDownCredit(): Observable<any> {
        return this.letDownCreditSubject.asObservable();
    }
    isLoadingLetDownCredit(): Observable<boolean> {
        return this.loadingTransactionDetailsSubject.asObservable();
    }

}
