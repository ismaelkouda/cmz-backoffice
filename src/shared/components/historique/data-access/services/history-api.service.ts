import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../services/env.service';
import { HistoryEndpointEnum } from '../enums/history-endpoint.enum';
import { DetailsHistoryData } from '../interfaces/details-historique.interface';
import { EndpointParamsService } from '../../../../services/endpoint-params.service';
import { historyApiResponseInterface, historyInterface } from '../interfaces/history.interface';
import { Paginate } from '@shared/interfaces/paginate';
import { historyFilterInterface } from '../interfaces/history-filter.interface';

@Injectable()

export class HistoryApiService {

    private BASE_URL: string;

    constructor(private http: HttpClient, private envService: EnvService, 
        private endpointParamsService: EndpointParamsService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer les historiques*************** */

    private historySubject = new BehaviorSubject<Array<historyInterface>>([]);
    private loadingHistorySubject = new BehaviorSubject<boolean>(false);
    private historyPagination = new BehaviorSubject<Paginate<historyInterface>>({} as Paginate<historyInterface>);
    private historySelected = new BehaviorSubject<historyInterface>({} as historyInterface);
    private dataFilterHistorySubject = new BehaviorSubject<historyFilterInterface>({} as historyFilterInterface);
    private dataNbrPageHistorySubject = new BehaviorSubject<string>('1');
    private apiResponseHistorySubject = new BehaviorSubject<historyApiResponseInterface>({} as historyApiResponseInterface);

    fetchHistory(data: historyFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingHistorySubject.getValue()) return; // Évite les doublons
        const url: string = <string>HistoryEndpointEnum.GET_ALL_HISTORIQUE.replace('{page}', nbrPage);
        this.loadingHistorySubject.next(true);

        this.http
            .post<Object>(this.BASE_URL+url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.historySubject.next(response?.['data']?.['data']);
                    this.historyPagination.next(response?.['data']);
                    this.apiResponseHistorySubject.next(response);
                    this.dataFilterHistorySubject.next(data);
                    this.dataNbrPageHistorySubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching history', error);
                    return of([]);
                }),
                finalize(() => this.loadingHistorySubject.next(false))
            )
            .subscribe();
    }

    getHistory(): Observable<Array<historyInterface>> {
        return this.historySubject.asObservable();
    }

    isLoadingHistory(): Observable<boolean> {
        return this.loadingHistorySubject.asObservable();
    }
    getHistoryPagination(): Observable<Paginate<historyInterface>> {
        return this.historyPagination.asObservable();
    }
    getDataFilterHistory(): Observable<historyFilterInterface> {
        return this.dataFilterHistorySubject.asObservable();
    }
    getDataNbrPageHistory(): Observable<string> {
        return this.dataNbrPageHistorySubject.asObservable();
    }
    getApiResponseHistory(): Observable<historyApiResponseInterface> {
        return this.apiResponseHistorySubject.asObservable();
    }
    getHistorySelected(): Observable<historyInterface> {
        return this.historySelected.asObservable();
    }
    setHistorySelected(history: historyInterface): void {
        this.historySelected.next(history);
    }


    /*********************Méthode pour récupérer les details de l'historique*************** */

    private detailsHistorySubject = new BehaviorSubject<DetailsHistoryData>({} as DetailsHistoryData);
    private loadingDetailsHistorySubject = new BehaviorSubject<boolean>(false);


    fetchDetailsHistory(idModel: number, dataFilter: Record<string, any>[]): void {
        if (this.loadingDetailsHistorySubject.getValue()) return; // Évite les doublons
        const queryParams = this.endpointParamsService.buildFilteredUrl(dataFilter);
        const url = `${HistoryEndpointEnum.GET_ALL_DETAILS_HISTORIQUE.replace('{id}', JSON.stringify(idModel))}?${queryParams}`;
        this.loadingDetailsHistorySubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.detailsHistorySubject.next(response?.['data']);
                    console.log('response?.[\'data\']', response?.['data'])
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching detailsHistory', error);
                    return of([]);
                }),
                finalize(() => this.loadingDetailsHistorySubject.next(false))
            )
            .subscribe();
    }

    getDetailsHistory(): Observable<DetailsHistoryData> {
        return this.detailsHistorySubject.asObservable();
    }

    isLoadingDetailsHistory(): Observable<boolean> {
        return this.loadingDetailsHistorySubject.asObservable();
    }
}
