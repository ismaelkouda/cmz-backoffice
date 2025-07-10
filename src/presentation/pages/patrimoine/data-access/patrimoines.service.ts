import { EnvService } from 'src/shared/services/env.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';

@Injectable()
export class PatrimoinesService {
    public baseUrl: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.baseUrl = this.envService.apiUrl;
    }
    /*********************Méthode pour récupérer la liste des SIMS*************** */

    private simsSubject = new BehaviorSubject<any[]>([]);
    private simsPagination = new BehaviorSubject<any>(null);
    private simsSelected = new BehaviorSubject<any>({} as any);
    private loadingSimsSubject = new BehaviorSubject<boolean>(false);
    private dataFilterSimsSubject = new BehaviorSubject<any>({} as any);
    private dataNbrPageSimsSubject = new BehaviorSubject<string>('1');
    private apiResponseSimsSubject = new BehaviorSubject<any>(null);

    fetchSims(data: Object, nbrPage: string = '1'): void {
        if (this.loadingSimsSubject.getValue()) return; // Évite les doublons

        const url: string =
            EndPointUrl.POST_PATRIMOINE_SIM_SIMS_ALL_PAGE.replace(
                '{page}',
                nbrPage
            );
        this.loadingSimsSubject.next(true);

        this.httpClient
            .post<Object>(`${this.baseUrl}${url}`, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.simsSubject.next(
                        response?.['data']?.data.map((demande) => {
                            return {
                                ...demande,
                                demandeur:
                                    demande.demandeur_nom +
                                    ' ' +
                                    demande.demandeur_prenoms,
                            };
                        })
                    );
                    this.simsPagination.next(response?.['data']);
                    this.apiResponseSimsSubject.next(response);
                    this.dataFilterSimsSubject.next(data);
                    this.dataNbrPageSimsSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sims', error);
                    return of([]);
                }),
                finalize(() => this.loadingSimsSubject.next(false))
            )
            .subscribe();
    }

    getSims(): Observable<any[]> {
        return this.simsSubject.asObservable();
    }
    getSimsPagination(): any {
        return this.simsPagination.asObservable();
    }

    isLoadingSims(): Observable<boolean> {
        return this.loadingSimsSubject.asObservable();
    }
    getSimsSelected(): Observable<any> {
        return this.simsSelected.asObservable();
    }
    setSimsSelected(sims: any): void {
        this.simsSelected.next(sims);
    }
    getDataFilterSims(): Observable<any> {
        return this.dataFilterSimsSubject.asObservable();
    }
    getDataNbrPageSims(): Observable<string> {
        return this.dataNbrPageSimsSubject.asObservable();
    }

    getApiResponseSims(): Observable<Object> {
        return this.apiResponseSimsSubject.asObservable();
    }
    // PostPatrimoineSimSimsAllPage(data: Object, page): Observable<any> {
    //   const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_ALL_PAGE).replace('{page}', page);
    //   return this.httpClient.post(`${this.baseUrl}${url}`, data);
    // }

    PostPatrimoineSimCartonSimBlancheDetailsPage(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.POST_PATRIMOINE_SIM_CARTON_SIM_BLANCHES_DETAILS_PAGE
        )).replace('{page}', page);
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }
    PostPatrimoineSimCartonSimBlancheAllPage(
        data: Object,
        page
    ): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.POST_PATRIMOINE_SIM_CARTON_SIM_BLANCHES_PAGE
        )).replace('{page}', page);
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }

    /*********************Méthode pour récupérer la liste des SIMS details*************** */

    private simsDetailsSubject = new BehaviorSubject<any[]>([]);
    private simsDetailsPagination = new BehaviorSubject<any>(null);
    private loadingSimsDetailsSubject = new BehaviorSubject<boolean>(false);
    private lastRequestSimsDetailsSubject = new BehaviorSubject<any>(null);
    private apiResponseSimsDetailsSubject = new BehaviorSubject<any>(null);

    fetchSimsDetails(imsi: string): void {
        if (this.loadingSimsDetailsSubject.getValue()) return; // Évite les doublons

        const url: string =
            EndPointUrl.POST_PATRIMOINE_SIM_SIMS_imsi_Details.replace(
                '{imsi}',
                imsi
            );
        this.loadingSimsDetailsSubject.next(true);

        this.httpClient
            .post<Object>(`${this.baseUrl}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.simsDetailsSubject.next(response?.['data']);
                    this.simsDetailsPagination.next(response?.['data']);
                    this.apiResponseSimsDetailsSubject.next(response);
                    this.lastRequestSimsDetailsSubject.next({});
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching simsDetails', error);
                    return of([]);
                }),
                finalize(() => this.loadingSimsDetailsSubject.next(false))
            )
            .subscribe();
    }

    getSimsDetails(): Observable<any[]> {
        return this.simsDetailsSubject.asObservable();
    }
    getSimsDetailsPagination(): any {
        return this.simsDetailsPagination.asObservable();
    }

    isLoadingSimsDetails(): Observable<boolean> {
        return this.loadingSimsDetailsSubject.asObservable();
    }

    getLastRequestSimsDetails(): Observable<any> {
        return this.lastRequestSimsDetailsSubject.asObservable();
    }

    getApiResponseSimsDetails(): Observable<Object> {
        return this.apiResponseSimsDetailsSubject.asObservable();
    }

    // PostPatrimoineSimSimsimsiDetails(imsi: string): Observable<any> {
    //   const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_imsi_Details).replace('{imsi}', imsi)
    //   return this.httpClient.post(`${this.baseUrl}${url}`, {});
    // }
    PostPatrimoineSimSimsUpdate(data): Observable<any> {
        const url: string = <string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_UPDATE;
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }

    PostPatrimoineSimEtatsDesSoldesActualisationSimple(data): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_PATRIMOINE_SIM_ETATS_DES_SOLDES_ACTUALISATION_SIMPLE
        );
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }
    PostParametresSecuriteNiveauDeuxSimple(data: Object): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_PARAMETRES_SECURITE_NIVEAU_DEUX_SIMPLE
        );
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }

    PostParametresSecuriteNiveauUnSimple(data: Object): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_PARAMETRES_SECURITE_NIVEAU_UN_SIMPLE
        );
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }

    PostPatrimoineSimSimsAllUsages(data: Object): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_PATRIMOINE_SIM_SIMS_ALL_USAGES
        );
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }

    PostParametresSecuriteNiveauTroisSimple(data: Object): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_PARAMETRES_SECURITE_NIVEAU_TROIS_SIMPLE
        );
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }
    GetAllSmsBalanceStatus(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_ALL_ETAT_SOLDE_SMS
        )).replace('{page}', page);
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
    }
}
