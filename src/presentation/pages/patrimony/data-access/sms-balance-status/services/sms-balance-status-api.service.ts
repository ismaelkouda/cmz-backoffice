import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { smsBalanceStatusApiResponseInterface, smsBalanceStatusInterface } from '../interfaces/sms-balance-status.interface';
import { smsBalanceStatusEndpointEnum } from '../enums/sms-balance-status-endpoint.enum';
import { smsBalanceStatusFilterInterface } from '../interfaces/sms-balance-status-filter.interface';

@Injectable()

export class smsBalanceStatusApiService {

    private BASE_URL: string;

    constructor(private httpClient: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste sms-balance-status*************** */
    
    private smsBalanceStatusSubject = new BehaviorSubject<Array<smsBalanceStatusInterface>>([]);
    private smsBalanceStatusPagination = new BehaviorSubject<Paginate<smsBalanceStatusInterface>>({} as Paginate<smsBalanceStatusInterface>);
    private smsBalanceStatusSelected = new BehaviorSubject<smsBalanceStatusInterface>({} as smsBalanceStatusInterface);
    private loadingSmsBalanceStatusSubject = new BehaviorSubject<boolean>(false);
    private dataFilterSmsBalanceStatusSubject = new BehaviorSubject<smsBalanceStatusFilterInterface>({} as smsBalanceStatusFilterInterface);
    private dataNbrPageSmsBalanceStatusSubject = new BehaviorSubject<string>('1');
    private apiResponseSmsBalanceStatusSubject = new BehaviorSubject<smsBalanceStatusApiResponseInterface>({} as smsBalanceStatusApiResponseInterface);
    
    fetchSmsBalanceStatus(data: smsBalanceStatusFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingSmsBalanceStatusSubject.getValue()) return; // Évite les doublons pendant que l'api est en cours
        this.loadingSmsBalanceStatusSubject.next(true);
        const url: string = smsBalanceStatusEndpointEnum.PATRIMONY_SIM_SIMS_ALL_PAGE.replace('{page}', nbrPage);

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const smsBalanceStatus = response?.['data']?.data;
                    this.smsBalanceStatusSubject.next(smsBalanceStatus);
                    this.smsBalanceStatusPagination.next(response?.['data']);
                    this.apiResponseSmsBalanceStatusSubject.next(response);
                    this.dataFilterSmsBalanceStatusSubject.next(data);
                    this.dataNbrPageSmsBalanceStatusSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sms-balance-status', error);
                    return of([]);
                }),
                finalize(() => this.loadingSmsBalanceStatusSubject.next(false))
            )
            .subscribe();
    }

    getSmsBalanceStatus(): Observable<Array<smsBalanceStatusInterface>> {
        return this.smsBalanceStatusSubject.asObservable();
    }
    getSmsBalanceStatusPagination(): Observable<Paginate<smsBalanceStatusInterface>> {
        return this.smsBalanceStatusPagination.asObservable();
    }
    isLoadingSmsBalanceStatus(): Observable<boolean> {
        return this.loadingSmsBalanceStatusSubject.asObservable();
    }
    getDataFilterSmsBalanceStatus(): Observable<smsBalanceStatusFilterInterface> {
        return this.dataFilterSmsBalanceStatusSubject.asObservable();
    }
    getDataNbrPageSmsBalanceStatus(): Observable<string> {
        return this.dataNbrPageSmsBalanceStatusSubject.asObservable();
    }
    getApiResponseSmsBalanceStatus(): Observable<smsBalanceStatusApiResponseInterface> {
        return this.apiResponseSmsBalanceStatusSubject.asObservable();
    }
    getSmsBalanceStatusSelected(): Observable<smsBalanceStatusInterface> {
        return this.smsBalanceStatusSelected.asObservable();
    }
    setSmsBalanceStatusSelected(smsBalanceStatus: smsBalanceStatusInterface): void {
        this.smsBalanceStatusSelected.next(smsBalanceStatus);
    }
    
}
