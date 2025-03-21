import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { waitingQueueApiResponseInterface } from '../interfaces/waiting-queue.interface';
import { waitingQueueEndpointEnum } from '../enums/waiting-queue-endpoint.enum';
import { waitingQueueFilterInterface } from '../interfaces/waiting-queue-filter.interface';
import { Folder } from '../../../../../../shared/interfaces/folder';

@Injectable()

export class WaitingQueueApiService {
    private waitingQueueSubject = new BehaviorSubject<Array<Folder>>([]);
    private waitingQueuePagination = new BehaviorSubject<Paginate<Folder>>({} as Paginate<Folder>);
    private waitingQueueSelected = new BehaviorSubject<Folder>({} as Folder);
    private loadingWaitingQueueSubject = new BehaviorSubject<boolean>(false);
    private dataFilterWaitingQueueSubject = new BehaviorSubject<waitingQueueFilterInterface>({} as waitingQueueFilterInterface);
    private dataNbrPageWaitingQueueSubject = new BehaviorSubject<string>('1');
    private apiResponseWaitingQueueSubject = new BehaviorSubject<waitingQueueApiResponseInterface>({} as waitingQueueApiResponseInterface);

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste waiting-queue*************** */
    fetchWaitingQueue(data: waitingQueueFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingWaitingQueueSubject.getValue()) return;
        this.loadingWaitingQueueSubject.next(true);
        const url: string = waitingQueueEndpointEnum.SUPERVISION_OPERATIONS_FILE_ATTENTES.replace('{page}', nbrPage);

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const waitingQueue = response?.['data']?.data.map((demande) => {
                        return { ...demande, demandeur: demande.demandeur_nom + " " + demande.demandeur_prenoms };
                    });
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

    getWaitingQueue(): Observable<Array<Folder>> {
        return this.waitingQueueSubject.asObservable();
    }
    getWaitingQueuePagination(): Observable<Paginate<Folder>> {
        return this.waitingQueuePagination.asObservable();
    }
    isLoadingWaitingQueue(): Observable<boolean> {
        return this.loadingWaitingQueueSubject.asObservable();
    }
    getDataFilterWaitingQueue(): Observable<waitingQueueFilterInterface> {
        return this.dataFilterWaitingQueueSubject.asObservable();
    }
    getDataNbrPageWaitingQueue(): Observable<string> {
        return this.dataNbrPageWaitingQueueSubject.asObservable();
    }
    getApiResponseWaitingQueue(): Observable<waitingQueueApiResponseInterface> {
        return this.apiResponseWaitingQueueSubject.asObservable();
    }
    getWaitingQueueSelected(): Observable<Folder> {
        return this.waitingQueueSelected.asObservable();
    }
    setWaitingQueueSelected(waitingQueue: Folder): void {
        this.waitingQueueSelected.next(waitingQueue);
    }
}
