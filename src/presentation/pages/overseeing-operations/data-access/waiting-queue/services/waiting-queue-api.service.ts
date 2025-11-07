import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    WaitingQueueApiResponseInterface,
    WaitingQueueInterface,
} from '../../../../../../shared/interfaces/waiting-queue.interface';
import { EnvService } from '../../../../../../shared/services/env.service';
import { waitingQueueEndpointEnum } from '../enums/waiting-queue-endpoint.enum';
import { WaitingQueueFilterInterface } from '../interfaces/waiting-queue-filter.interface';

@Injectable()
export class WaitingQueueApiService {
    private BASE_URL: string;
    constructor(
        private http: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour récupérer la liste waiting-queue*************** */

    private waitingQueueSubject = new BehaviorSubject<
        Array<WaitingQueueInterface>
    >([]);
    private waitingQueuePagination = new BehaviorSubject<
        Paginate<WaitingQueueInterface>
    >({} as Paginate<WaitingQueueInterface>);
    private loadingWaitingQueueSubject = new BehaviorSubject<boolean>(false);
    private dataFilterWaitingQueueSubject =
        new BehaviorSubject<WaitingQueueFilterInterface>(
            {} as WaitingQueueFilterInterface
        );
    private dataNbrPageWaitingQueueSubject = new BehaviorSubject<string>('1');
    private apiResponseWaitingQueueSubject =
        new BehaviorSubject<WaitingQueueApiResponseInterface>(
            {} as WaitingQueueApiResponseInterface
        );

    fetchWaitingQueue(
        data: WaitingQueueFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingWaitingQueueSubject.getValue()) return;
        this.loadingWaitingQueueSubject.next(true);
        const url: string = waitingQueueEndpointEnum.WAITING_QUEUE.replace(
            '{page}',
            nbrPage
        );

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const waitingQueue = response?.['data']?.data.map(
                        (demande: WaitingQueueInterface) => {
                            return {
                                ...demande,
                                demandeur:
                                    demande.demandeur_nom +
                                    ' ' +
                                    demande.demandeur_prenoms,
                            };
                        }
                    );
                    this.waitingQueueSubject.next(waitingQueue);
                    this.waitingQueuePagination.next(response?.['data']);
                    this.apiResponseWaitingQueueSubject.next(response);
                    this.dataFilterWaitingQueueSubject.next(data);
                    this.dataNbrPageWaitingQueueSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching waitingQueue', error);
                    return of([]);
                }),
                finalize(() => this.loadingWaitingQueueSubject.next(false))
            )
            .subscribe();
    }

    getWaitingQueue(): Observable<Array<WaitingQueueInterface>> {
        return this.waitingQueueSubject.asObservable();
    }
    getWaitingQueuePagination(): Observable<Paginate<WaitingQueueInterface>> {
        return this.waitingQueuePagination.asObservable();
    }
    isLoadingWaitingQueue(): Observable<boolean> {
        return this.loadingWaitingQueueSubject.asObservable();
    }
    getDataFilterWaitingQueue(): Observable<WaitingQueueFilterInterface> {
        return this.dataFilterWaitingQueueSubject.asObservable();
    }
    getDataNbrPageWaitingQueue(): Observable<string> {
        return this.dataNbrPageWaitingQueueSubject.asObservable();
    }
    getApiResponseWaitingQueue(): Observable<WaitingQueueApiResponseInterface> {
        return this.apiResponseWaitingQueueSubject.asObservable();
    }
}
