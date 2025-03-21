import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { whiteSimCardGlobalStateInterface, whiteSimCardInterface, whiteSimCardResponseInterface } from '../interfaces/white-sim-card.interface';
import { whiteSimCardFilterInterface } from '../interfaces/white-sim-card-filter.interface';
import { whiteSimCardEndpointEnum } from '../enums/white-sim-card-endpoint.enum';

@Injectable()

export class whiteSimCardApiService {
    private whiteSimCardSubject = new BehaviorSubject<Array<whiteSimCardInterface>>([]);
    private whiteSimCardGlobalState = new BehaviorSubject<whiteSimCardGlobalStateInterface>({} as whiteSimCardGlobalStateInterface);
    private whiteSimCardPagination = new BehaviorSubject<Paginate<whiteSimCardInterface>>({} as Paginate<whiteSimCardInterface>);
    private whiteSimCardSelected = new BehaviorSubject<whiteSimCardInterface>({} as whiteSimCardInterface);
    private loadingWhiteSimCardSubject = new BehaviorSubject<boolean>(false);
    private dataFilterWhiteSimCardSubject = new BehaviorSubject<whiteSimCardFilterInterface>({} as whiteSimCardFilterInterface);
    private dataNbrPageWhiteSimCardSubject = new BehaviorSubject<string>('1');
    private apiResponseWhiteSimCardSubject = new BehaviorSubject<whiteSimCardResponseInterface>({} as whiteSimCardResponseInterface);

    private BASE_URL: string;
    constructor(private httpClient: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste white-sim-card*************** */
    fetchWhiteSimCard(data: whiteSimCardFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingWhiteSimCardSubject.getValue()) return; // Évite les doublons pendant que l'api est en cours
        this.loadingWhiteSimCardSubject.next(true);
        const url: string = whiteSimCardEndpointEnum.POST_PATRIMOINE_SIM_CARTON_SIM_BLANCHES_PAGE.replace('{page}', nbrPage);

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const whiteSimCard = response?.['data']?.data?.data;
                    this.whiteSimCardSubject.next(whiteSimCard);
                    this.whiteSimCardPagination.next(response?.['data']);
                    this.whiteSimCardGlobalState.next(response?.['data']?.data);
                    this.apiResponseWhiteSimCardSubject.next(response);
                    this.dataFilterWhiteSimCardSubject.next(data);
                    this.dataNbrPageWhiteSimCardSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching white-sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingWhiteSimCardSubject.next(false))
            )
            .subscribe();
    }

    getWhiteSimCard(): Observable<Array<whiteSimCardInterface>> {
        return this.whiteSimCardSubject.asObservable();
    }
    getWhiteSimCardPagination(): Observable<Paginate<whiteSimCardInterface>> {
        return this.whiteSimCardPagination.asObservable();
    }
    getWhiteSimCardGlobalState(): Observable<whiteSimCardGlobalStateInterface> {
        return this.whiteSimCardGlobalState.asObservable();
    }
    isLoadingWhiteSimCard(): Observable<boolean> {
        return this.loadingWhiteSimCardSubject.asObservable();
    }
    getDataFilterWhiteSimCard(): Observable<whiteSimCardFilterInterface> {
        return this.dataFilterWhiteSimCardSubject.asObservable();
    }
    getDataNbrPageWhiteSimCard(): Observable<string> {
        return this.dataNbrPageWhiteSimCardSubject.asObservable();
    }
    getApiResponseWhiteSimCard(): Observable<whiteSimCardResponseInterface> {
        return this.apiResponseWhiteSimCardSubject.asObservable();
    }
    getWhiteSimCardSelected(): Observable<whiteSimCardInterface> {
        return this.whiteSimCardSelected.asObservable();
    }
    setWhiteSimCardSelected(whiteSimCard: whiteSimCardInterface): void {
        this.whiteSimCardSelected.next(whiteSimCard);
    }

    /*********************Méthode pour récupérer la liste des SIMS details*************** */

//     private whiteSimCardDetailsSubject = new BehaviorSubject<whiteSimCardDetailsInterface>({} as whiteSimCardDetailsInterface);
//     private loadingWhiteSimCardDetailsSubject = new BehaviorSubject<boolean>(false);

//     fetchWhiteSimCardDetails(imsi: string): void {
//         if (this.loadingWhiteSimCardDetailsSubject.getValue()) return;

//         const url: string = whiteSimCardEndpointEnum.POST_PATRIMOINE_SIM_SIMS_imsi_Details.replace('{imsi}', imsi)
//         this.loadingWhiteSimCardDetailsSubject.next(true);

//         this.httpClient
//             .post<Object>(`${this.BASE_URL}${url}`, {})
//             .pipe(
//                 debounceTime(1000),
//                 switchMap((response: any) => {
//                     this.whiteSimCardDetailsSubject.next(response?.['data']);
//                     return of(response);
//                 }),
//                 catchError((error) => {
//                     console.error('Error fetching whiteSimCardDetails', error);
//                     return of([]);
//                 }),
//                 finalize(() => this.loadingWhiteSimCardDetailsSubject.next(false))
//             )
//             .subscribe();
//     }

//     getWhiteSimCardDetails(): Observable<whiteSimCardDetailsInterface> {
//         return this.whiteSimCardDetailsSubject.asObservable();
//     }

//     isLoadingWhiteSimCardDetails(): Observable<boolean> {
//         return this.loadingWhiteSimCardDetailsSubject.asObservable();
//     }
}
