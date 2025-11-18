import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomersActivateFilterInterface } from '@pages/requests-service/data-access/customers-activate/interfaces/customers-activate-filter.interface';
import { EndPointUrl } from '@shared/enum/api.enum';
import {
    ApiResponseApplicantInterface,
    ApplicantInterface,
} from '@shared/interfaces/applicant';
import {
    CustomersActivateApiResponseInterface,
    CustomersActivateInterface,
} from '@shared/interfaces/customers-activate.interface';
import { Paginate } from '@shared/interfaces/paginate';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { EnvService } from './env.service';

@Injectable({ providedIn: 'root' })
export class SharedService {
    private BASE_URL: string;

    constructor(
        private http: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour récupérer la liste des clients*************** */

    private applicantsSubject = new BehaviorSubject<ApplicantInterface[]>([]);
    private loadingApplicantsSubject = new BehaviorSubject<boolean>(false);
    private apiResponseApplicantsSubject =
        new BehaviorSubject<ApiResponseApplicantInterface>(
            {} as ApiResponseApplicantInterface
        );

    fetchApplicants(): void {
        if (this.loadingApplicantsSubject.getValue()) {
            return;
        }

        const url: string = EndPointUrl.GET_ALL_USERS;
        this.loadingApplicantsSubject.next(true);

        this.http
            .post<object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const formatData = response?.['data'].map(
                        (user: ApplicantInterface) => ({
                            ...user,
                            fullName: `${user.nom} ${user.prenoms}`,
                        })
                    );
                    this.applicantsSubject.next(formatData);
                    this.apiResponseApplicantsSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching applicants', error);
                    return of([]);
                }),
                finalize(() => this.loadingApplicantsSubject.next(false))
            )
            .subscribe();
    }

    getApplicants(): Observable<ApplicantInterface[]> {
        return this.applicantsSubject.asObservable();
    }

    isLoadingApplicants(): Observable<boolean> {
        return this.loadingApplicantsSubject.asObservable();
    }

    getApiResponseApplicants(): Observable<ApiResponseApplicantInterface> {
        return this.apiResponseApplicantsSubject.asObservable();
    }

    /*********************Méthode pour récupérer les historiques*************** */

    // private historySubject = new BehaviorSubject<Array<any>>([] as Array<any>);
    // private loadingHistorySubject = new BehaviorSubject<boolean>(false);
    // private historyPagination = new BehaviorSubject<any>(null);
    // private historySelected = new BehaviorSubject<any>({} as any);
    // private dataFilterHistorySubject = new BehaviorSubject<Object>({});
    // private apiResponseHistorySubject = new BehaviorSubject<any>(null);

    // fetchHistory(data, nbrPage: string = '1'): void {
    //     if (this.loadingHistorySubject.getValue()) return; // Évite les doublons
    //     const url: string = <string>EndPointUrl.GET_ALL_HISTORIQUE.replace('{page}', nbrPage);
    //     this.loadingHistorySubject.next(true);

    //     this.http
    //         .post<Object>(`${this.BASE_URL}${url}`, data)
    //         .pipe(
    //             debounceTime(1000),
    //             switchMap((response: any) => {
    //                 this.historySubject.next(response?.['data']);
    //                 this.historyPagination.next(response?.['data']);
    //                 this.apiResponseHistorySubject.next(response);
    //                 this.dataFilterHistorySubject.next(data);
    //                 return of(response);
    //             }),
    //             catchError((error) => {
    //                 console.error('Error fetching history', error);
    //                 return of([]);
    //             }),
    //             finalize(() => this.loadingHistorySubject.next(false))
    //         )
    //         .subscribe();
    // }

    // getHistory(): Observable<Array<any>> {
    //     return this.historySubject.asObservable();
    // }

    // isLoadingHistory(): Observable<boolean> {
    //     return this.loadingHistorySubject.asObservable();
    // }
    // getHistoryPagination(): any {
    //     return this.historyPagination.asObservable();
    // }
    // getDataFilterHistory(): Observable<Object> {
    //     return this.dataFilterHistorySubject.asObservable();
    // }
    // getApiResponseHistory(): Observable<Object> {
    //     return this.apiResponseHistorySubject.asObservable();
    // }
    // getHistorySelected(): Observable<Folder> {
    //     return this.historySelected.asObservable();
    // }
    // setHistorySelected(history: any): void {
    //     this.historySelected.next(history);
    // }

    // /*********************Méthode pour récupérer les details de l'historique*************** */

    // private detailsHistorySubject = new BehaviorSubject<Array<HistoryData>>([] as Array<HistoryData>);
    // private loadingDetailsHistorySubject = new BehaviorSubject<boolean>(false);

    // fetchDetailsHistory(idModel: number, dataFilter: Record<string, any>[]): void {
    //     if (this.loadingDetailsHistorySubject.getValue()) return; // Évite les doublons
    //     const queryParams = this.historyService.buildFilteredUrl(dataFilter);
    //     const url = `${EndPointUrl.GET_ALL_DETAILS_HISTORIQUE.replace('{id}', JSON.stringify(idModel))}?${queryParams}`;
    //     this.loadingDetailsHistorySubject.next(true);

    //     this.http
    //         .post<Object>(`${this.BASE_URL}${url}`, {})
    //         .pipe(
    //             debounceTime(1000),
    //             switchMap((response: any) => {
    //                 this.detailsHistorySubject.next(response?.['data']);
    //                 return of(response);
    //             }),
    //             catchError((error) => {
    //                 console.error('Error fetching detailsHistory', error);
    //                 return of([]);
    //             }),
    //             finalize(() => this.loadingDetailsHistorySubject.next(false))
    //         )
    //         .subscribe();
    // }

    // getDetailsHistory(): Observable<Array<HistoryData>> {
    //     return this.detailsHistorySubject.asObservable();
    // }

    // isLoadingDetailsHistory(): Observable<boolean> {
    //     return this.loadingDetailsHistorySubject.asObservable();
    // }

    // getSupervisionOperationsDemandesServicesDetails(numeroDemande: string): Observable<any> {
    //     const url: string = <string>EndPointUrl.GET_SUPERVISION_OPERATIONS_DEMANDES_SERVICES_numeroDemande_DETAILS.replace('{numeroDemande}', numeroDemande);
    //     return this.http.get(`${this.BASE_URL}${url}`);
    // }
    /*********************Méthode pour récupérer la liste des notifications*************** */

    /* private notificationListSubject = new BehaviorSubject<
        notificationsEntity[]
    >([]);
    private loadingNotificationSubject = new BehaviorSubject<boolean>(false);
    private notificationPaginationSubject = new BehaviorSubject<
        Paginate<notificationsApiResponseEntity>
    >({} as Paginate<notificationsApiResponseEntity>);

    fetchNotification(page = '1'): void {
        if (this.loadingNotificationSubject.getValue()) {
            return;
        }

        const url: string = EndPointUrl.GET_ALL_NOTIFICATIONS.replace(
            '{page}',
            page
        );
        this.loadingNotificationSubject.next(true);
        this.http
            .post<object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const paginationData: Paginate<any> = response?.['data'];
                    this.notificationListSubject.next(response?.['data']?.data);
                    this.notificationPaginationSubject.next(paginationData);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching notification', error);
                    return of([]);
                }),
                finalize(() => this.loadingNotificationSubject.next(false))
            )
            .subscribe();
    }

    getNotificationList(): Observable<notificationsEntity[]> {
        return this.notificationListSubject.asObservable();
    }

    isLoadingNotification(): Observable<boolean> {
        return this.loadingNotificationSubject.asObservable();
    }
    getNotificationPagination(): Observable<
        Paginate<notificationsApiResponseEntity>
    > {
        return this.notificationPaginationSubject.asObservable();
    } */

    /*********************Méthode pour récupérer le nombre de notification non lu*************** */

    private loadingUnReadNotificationSubject = new BehaviorSubject<boolean>(
        false
    );
    private apiResponseUnReadNotificationSubject = new BehaviorSubject<number>(
        {} as number
    );

    fetchUnReadNotifications(): void {
        /* if (this.loadingUnReadNotificationSubject.getValue()) return;
        this.loadingUnReadNotificationSubject.next(true);
        const url: string = EndPointUrl.COUNT_UNREAD_NOTIFICATIONS;
        this.http
            .post(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    this.apiResponseUnReadNotificationSubject.next(
                        response.data
                    );
                    return of(response);
                }),
                catchError((error) => {
                    return of([]);
                }),
                finalize(() =>
                    this.loadingUnReadNotificationSubject.next(false)
                )
            )
            .subscribe(); */
    }

    isLoadingUnReadNotifications(): Observable<boolean> {
        return this.loadingUnReadNotificationSubject.asObservable();
    }
    getApiResponseUnReadNotifications(): Observable<number> {
        return this.apiResponseUnReadNotificationSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des Regimes*************** */

    private regimesBusinessSubject = new BehaviorSubject<
        { code: string; nom: string }[]
    >([]);
    private loadingRegimesBusinessSubject = new BehaviorSubject<boolean>(false);

    fetchRegimesBusiness(): void {
        if (this.loadingRegimesBusinessSubject.getValue()) {
            return;
        } // Évite les doublons

        const url: string = EndPointUrl.REGIME_BUSINESS;
        this.loadingRegimesBusinessSubject.next(true);

        this.http
            .post<object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.regimesBusinessSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching regimesBusiness', error);
                    return of([]);
                }),
                finalize(() => this.loadingRegimesBusinessSubject.next(false))
            )
            .subscribe();
    }

    getRegimesBusiness(): Observable<{ code: string; nom: string }[]> {
        return this.regimesBusinessSubject.asObservable();
    }

    isLoadingRegimesBusiness(): Observable<boolean> {
        return this.loadingRegimesBusinessSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des Formules legaux*************** */

    private legalFormsSubject = new BehaviorSubject<
        { code: string; nom: string }[]
    >([]);
    private loadingLegalFormsSubject = new BehaviorSubject<boolean>(false);

    fetchLegalForms(): void {
        if (this.loadingLegalFormsSubject.getValue()) {
            return;
        }

        const url: string = EndPointUrl.LEGAL_FORMS;
        this.loadingLegalFormsSubject.next(true);

        this.http
            .post<object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.legalFormsSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching legalForms', error);
                    return of([]);
                }),
                finalize(() => this.loadingLegalFormsSubject.next(false))
            )
            .subscribe();
    }

    getLegalForms(): Observable<{ code: string; nom: string }[]> {
        return this.legalFormsSubject.asObservable();
    }

    isLoadingLegalForms(): Observable<boolean> {
        return this.loadingLegalFormsSubject.asObservable();
    }

    /*********************Méthode pour valider une activation de client *************** */

    private customersActivateSubject = new BehaviorSubject<
        CustomersActivateInterface[]
    >([]);
    private customersActivatePagination = new BehaviorSubject<
        Paginate<CustomersActivateInterface>
    >({} as Paginate<CustomersActivateInterface>);
    private loadingCustomersActivateSubject = new BehaviorSubject<boolean>(
        false
    );
    private dataFilterCustomersActivateSubject =
        new BehaviorSubject<CustomersActivateFilterInterface>(
            {} as CustomersActivateFilterInterface
        );
    private dataNbrPageCustomersActivateSubject = new BehaviorSubject<string>(
        '1'
    );
    private apiResponseCustomersActivateSubject =
        new BehaviorSubject<CustomersActivateApiResponseInterface>(
            {} as CustomersActivateApiResponseInterface
        );
    fetchCustomersActivate(
        data: CustomersActivateFilterInterface,
        nbrPage = '1'
    ): void {
        if (this.loadingCustomersActivateSubject.getValue()) {
            return;
        }
        this.loadingCustomersActivateSubject.next(true);
        const url: string = EndPointUrl.CUSTOMERS_MANAGED.replace(
            '{page}',
            nbrPage
        );

        this.http
            .post<object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const customersActivate = response?.['data']?.data;
                    this.customersActivateSubject.next(customersActivate);
                    this.customersActivatePagination.next(response?.['data']);
                    this.apiResponseCustomersActivateSubject.next(response);
                    this.dataFilterCustomersActivateSubject.next(data);
                    this.dataNbrPageCustomersActivateSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingCustomersActivateSubject.next(false))
            )
            .subscribe();
    }

    getCustomersActivate(): Observable<CustomersActivateInterface[]> {
        return this.customersActivateSubject.asObservable();
    }
    getCustomersActivatePagination(): Observable<
        Paginate<CustomersActivateInterface>
    > {
        return this.customersActivatePagination.asObservable();
    }
    isLoadingCustomersActivate(): Observable<boolean> {
        return this.loadingCustomersActivateSubject.asObservable();
    }
    getDataFilterCustomersActivate(): Observable<CustomersActivateFilterInterface> {
        return this.dataFilterCustomersActivateSubject.asObservable();
    }
    getDataNbrPageCustomersActivate(): Observable<string> {
        return this.dataNbrPageCustomersActivateSubject.asObservable();
    }
    getApiResponseCustomersActivate(): Observable<CustomersActivateApiResponseInterface> {
        return this.apiResponseCustomersActivateSubject.asObservable();
    }
}
