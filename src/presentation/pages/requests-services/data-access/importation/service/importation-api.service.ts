import { ImportationInterface } from './../interface/importation.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { ImportationEndpointEnum } from '../enums/importation-endpoint.enum';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { EnvService } from '../../../../../../shared/services/env.service';
import { DetailsImportationInterface } from '../../../feature/importation/details-importation/data-access/interfaces/details-importation.interface';

@Injectable()
export class ImportationService {
    private BASE_URL: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste des demands importées*************** */

    private demandsSubject = new BehaviorSubject<ImportationInterface[]>([]);
    private demandsPagination = new BehaviorSubject<
        Paginate<ImportationInterface>
    >({} as Paginate<ImportationInterface>);
    private demandSelected = new BehaviorSubject<ImportationInterface>(
        {} as ImportationInterface
    );
    private loadingDemandsSubject = new BehaviorSubject<boolean>(false);
    private dataFilterDemandsSubject = new BehaviorSubject<Object>({});
    private dataNbrPageDemandsSubject = new BehaviorSubject<string>('1');
    private apiResponseDemandsSubject = new BehaviorSubject<any>(null);

    fetchDemands(data: Object, nbrPage: string = '1'): void {
        if (this.loadingDemandsSubject.getValue()) return;
        this.loadingDemandsSubject.next(true);
        const url: string =
            ImportationEndpointEnum.PATRIMOINE_SIM_DEMANDES_SERVICES_ALL.replace(
                '{page}',
                nbrPage
            );

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const demands = response?.['data']?.data.map((demande) => ({
                        ...demande,
                        demandeur: `${demande.demandeur_nom} ${demande.demandeur_prenoms}`,
                    }));
                    this.demandsSubject.next(demands);
                    this.demandsPagination.next(response?.['data']);
                    this.apiResponseDemandsSubject.next(response);
                    this.dataFilterDemandsSubject.next(data);
                    this.dataNbrPageDemandsSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching demands', error);
                    return of([]);
                }),
                finalize(() => this.loadingDemandsSubject.next(false))
            )
            .subscribe();
    }

    getDemands(): Observable<any[]> {
        return this.demandsSubject.asObservable();
    }
    getDemandsPagination(): any {
        return this.demandsPagination.asObservable();
    }
    isLoadingDemands(): Observable<boolean> {
        return this.loadingDemandsSubject.asObservable();
    }
    getDataFilterDemands(): Observable<Object> {
        return this.dataFilterDemandsSubject.asObservable();
    }
    getDataNbrPageDemands(): Observable<string> {
        return this.dataNbrPageDemandsSubject.asObservable();
    }
    getApiResponseDemands(): Observable<Object> {
        return this.apiResponseDemandsSubject.asObservable();
    }
    getDemandSelected(): Observable<ImportationInterface> {
        return this.demandSelected.asObservable();
    }
    setDemandSelected(demand: ImportationInterface): void {
        this.demandSelected.next(demand);
    }

    /*********************Méthode pour récupérer la liste des détails demands*************** */

    private simDemandSubject = new BehaviorSubject<
        DetailsImportationInterface[]
    >([]);
    private simDemandPagination = new BehaviorSubject<any>(null);
    private loadingSimDemandSubject = new BehaviorSubject<boolean>(false);
    private lastRequestSimDemandSubject = new BehaviorSubject<any>(null);
    private apiResponseSimDemandSubject = new BehaviorSubject<any>(null);
    private dataFilterSimDemandSubject = new BehaviorSubject<any>({});

    fetchSimDemand(data: Object, nbrPage: string = '1'): void {
        if (this.loadingSimDemandSubject.getValue()) return;

        const url: string =
            ImportationEndpointEnum.GET_IMPORTANTION_SIM.replace(
                '{page}',
                nbrPage
            ).replace('{numero_demande}', data['numero_demande']);
        this.loadingSimDemandSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.simDemandSubject.next(response?.['data']?.rapports);
                    this.simDemandPagination.next(response?.['data']?.rapports);
                    this.apiResponseSimDemandSubject.next(response?.data);
                    this.dataFilterSimDemandSubject.next(data);
                    this.lastRequestSimDemandSubject.next({});
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching simDemand', error);
                    return of([]);
                }),
                finalize(() => this.loadingSimDemandSubject.next(false))
            )
            .subscribe();
    }

    getSimDemand(): Observable<DetailsImportationInterface[]> {
        return this.simDemandSubject.asObservable();
    }
    getSimDemandPagination(): any {
        return this.simDemandPagination.asObservable();
    }
    getDataFilterSimDemand(): Observable<any> {
        return this.dataFilterSimDemandSubject.asObservable();
    }

    isLoadingSimDemand(): Observable<boolean> {
        return this.loadingSimDemandSubject.asObservable();
    }

    getLastRequestSimDemand(): Observable<any> {
        return this.lastRequestSimDemandSubject.asObservable();
    }

    getApiResponseSimDemand(): Observable<Object> {
        return this.apiResponseSimDemandSubject.asObservable();
    }

    /*********************Méthode pour creer une importation*************** */

    // private loadingTakeTaskSubject = new BehaviorSubject<boolean>(false);
    // private apiResponseTakeTaskSubject = new BehaviorSubject<any>({} as any);

    // fetchTakeTasks(
    //     data: Object,
    //     toastService: ToastrService | null,
    //     reloadData: () => void,
    //     handleCloseModal: () => void = () => { }
    // ): void {
    //     if (this.loadingTakeTaskSubject.getValue()) return;
    //     this.loadingTakeTaskSubject.next(true);
    //     const url: string = EndPointUrl.TAKE_TASK;
    //     this.http
    //         .post(`${this.BASE_URL}${url}`, data)
    //         .pipe(
    //             debounceTime(500),
    //             switchMap((response: any) => {
    //                 this.apiResponseTakeTaskSubject.next(response);
    //                 this.displayToastTakeTask(response, toastService);
    //                 reloadData();
    //                 if (handleCloseModal) {
    //                     handleCloseModal();
    //                 }
    //                 handleCloseModal();
    //                 return of(response);
    //             }),
    //             catchError((error) => {
    //                 console.error("Error fetching read notifications", error);
    //                 return of([]);
    //             }),
    //             finalize(() => this.loadingTakeTaskSubject.next(false))
    //         )
    //         .subscribe();
    // }

    // isLoadingTakeTasks(): Observable<boolean> {
    //     return this.loadingTakeTaskSubject.asObservable();
    // }
    // getApiResponseTakeTasks(): Observable<any> {
    //     return this.apiResponseTakeTaskSubject.asObservable();
    // }

    // displayToastTakeTask(response: any, toastService: ToastrService | null) {
    //     if (response?.error && response.error === false && toastService) {
    //         toastService.success(response.message);
    //     } else if (response?.error && response.error === true) {
    //         toastService?.error(response.error.message);
    //     }
    // }
}
