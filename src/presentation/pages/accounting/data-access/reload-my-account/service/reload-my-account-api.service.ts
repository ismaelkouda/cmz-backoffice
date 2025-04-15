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


    creditReloadMyAccount(data): Observable<any> {
        const url: string = <string>reloadMyAccountEndpointEnum.MANAGEMENT_INVOICE_ACCOUNTS_STORE;
        return this.httpClient.post(`${this.BASE_URL}${url}`, data);
    }

}
