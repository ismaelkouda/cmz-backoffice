import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { simCardApiResponseInterface, simCardInterface } from '../interfaces/sim-card.interface';
import { simCardEndpointEnum } from '../enums/sim-card-endpoint.enum';
import { simCardFilterInterface } from '../interfaces/sim-card-filter.interface';
import { simCardDetailsInterface } from '../interfaces/sim-card-details.interface';

@Injectable()

export class simCardApiService {
    private simCardSubject = new BehaviorSubject<Array<simCardInterface>>([]);
    private simCardPagination = new BehaviorSubject<Paginate<simCardInterface>>({} as Paginate<simCardInterface>);
    private simCardSelected = new BehaviorSubject<simCardInterface>({} as simCardInterface);
    private loadingSimCardSubject = new BehaviorSubject<boolean>(false);
    private dataFilterSimCardSubject = new BehaviorSubject<simCardFilterInterface>({} as simCardFilterInterface);
    private dataNbrPageSimCardSubject = new BehaviorSubject<string>('1');
    private apiResponseSimCardSubject = new BehaviorSubject<simCardApiResponseInterface>({} as simCardApiResponseInterface);

    private BASE_URL: string;
    constructor(private httpClient: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste sim-card*************** */
    fetchSimCard(data: simCardFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingSimCardSubject.getValue()) return; // Évite les doublons pendant que l'api est en cours
        this.loadingSimCardSubject.next(true);
        const url: string = simCardEndpointEnum.PATRIMONY_SIM_SIMS_ALL_PAGE.replace('{page}', nbrPage);

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const simCard = response?.['data']?.data;
                    this.simCardSubject.next(simCard);
                    this.simCardPagination.next(response?.['data']);
                    this.apiResponseSimCardSubject.next(response);
                    this.dataFilterSimCardSubject.next(data);
                    this.dataNbrPageSimCardSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingSimCardSubject.next(false))
            )
            .subscribe();
    }

    getSimCard(): Observable<Array<simCardInterface>> {
        return this.simCardSubject.asObservable();
    }
    getSimCardPagination(): Observable<Paginate<simCardInterface>> {
        return this.simCardPagination.asObservable();
    }
    isLoadingSimCard(): Observable<boolean> {
        return this.loadingSimCardSubject.asObservable();
    }
    getDataFilterSimCard(): Observable<simCardFilterInterface> {
        return this.dataFilterSimCardSubject.asObservable();
    }
    getDataNbrPageSimCard(): Observable<string> {
        return this.dataNbrPageSimCardSubject.asObservable();
    }
    getApiResponseSimCard(): Observable<simCardApiResponseInterface> {
        return this.apiResponseSimCardSubject.asObservable();
    }
    getSimCardSelected(): Observable<simCardInterface> {
        return this.simCardSelected.asObservable();
    }
    setSimCardSelected(simCard: simCardInterface): void {
        this.simCardSelected.next(simCard);
    }

    /*********************Méthode pour récupérer la liste des SIMS details*************** */

    private simCardDetailsSubject = new BehaviorSubject<simCardDetailsInterface>({} as simCardDetailsInterface);
    private loadingSimCardDetailsSubject = new BehaviorSubject<boolean>(false);

    fetchSimCardDetails(imsi: string): void {
        if (this.loadingSimCardDetailsSubject.getValue()) return;

        const url: string = simCardEndpointEnum.POST_PATRIMOINE_SIM_SIMS_imsi_Details.replace('{imsi}', imsi)
        this.loadingSimCardDetailsSubject.next(true);

        this.httpClient
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.simCardDetailsSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching simCardDetails', error);
                    return of([]);
                }),
                finalize(() => this.loadingSimCardDetailsSubject.next(false))
            )
            .subscribe();
    }

    getSimCardDetails(): Observable<simCardDetailsInterface> {
        return this.simCardDetailsSubject.asObservable();
    }

    isLoadingSimCardDetails(): Observable<boolean> {
        return this.loadingSimCardDetailsSubject.asObservable();
    }
}
