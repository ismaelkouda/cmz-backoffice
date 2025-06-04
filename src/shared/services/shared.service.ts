import { BankBenefitInterface } from './../interfaces/bank-beneficiaire.interface';
import { ApnInterface } from './../interfaces/apn.interface';
import { ThirdLevelInterface } from './../interfaces/third-level.interface';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from '../enum/api.enum';
import { DetailsDemand } from '../components/form-folder/data-access/form-folder.interface';
import { SimDemand } from '../interfaces/details-mobile-subscriptions.interface';
import { Folder } from '../interfaces/folder';
import { Paginate } from '../interfaces/paginate';
import { FormulasInterface } from '../interfaces/formulas.interface';
import { FirstLevelInterface } from '../interfaces/first-level.interface';
import { BankInterface } from '../interfaces/bank.interface';
import {
    notificationsCenterApiResponseInterface,
    notificationsCenterInterface,
} from '../../presentation/pages/overseeing-operations/data-access/notifications-center/interfaces/notifications-center.interface';

@Injectable({ providedIn: 'root' })
export class SharedService {
    private BASE_URL: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste des demands*************** */

    private demandsSubject = new BehaviorSubject<Folder[]>([]);
    private demandsPagination = new BehaviorSubject<Paginate<Folder>>(
        {} as Paginate<Folder>
    );
    private demandSelected = new BehaviorSubject<Folder>({} as Folder);
    private loadingDemandsSubject = new BehaviorSubject<boolean>(false);
    private dataFilterDemandsSubject = new BehaviorSubject<Object>({});
    private dataNbrPageDemandsSubject = new BehaviorSubject<string>('1');
    private apiResponseDemandsSubject = new BehaviorSubject<any>(null);

    fetchDemands(data: Object, nbrPage: string = '1'): void {
        if (this.loadingDemandsSubject.getValue()) return;
        this.loadingDemandsSubject.next(true);
        const url: string =
            EndPointUrl.PATRIMOINE_SIM_DEMANDES_SERVICES_ALL.replace(
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
    getDemandSelected(): Observable<Folder> {
        return this.demandSelected.asObservable();
    }
    setDemandSelected(demand: Folder): void {
        this.demandSelected.next(demand);
    }

    /*********************Méthode pour récupérer la liste des détails demands*************** */

    private detailsDemandSubject = new BehaviorSubject<DetailsDemand>(
        {} as DetailsDemand
    );
    private detailsDemandPagination = new BehaviorSubject<any>(null);
    private loadingDetailsDemandSubject = new BehaviorSubject<boolean>(false);
    private lastRequestDetailsDemandSubject = new BehaviorSubject<any>(null);
    private apiResponseDetailsDemandSubject = new BehaviorSubject<any>(null);

    fetchDetailsDemand(numberDemand: string, type: any = null): void {
        if (this.loadingDetailsDemandSubject.getValue()) return;

        const url: string =
            EndPointUrl.GET_SUPERVISION_OPERATIONS_DEMANDES_SERVICES_DETAILS.replace(
                '{numberDemand}',
                numberDemand
            );
        const urlInvoice: string = EndPointUrl.GET_INVOICE_DETAILS.replace(
            '{numberDemand}',
            numberDemand
        );

        this.loadingDetailsDemandSubject.next(true);

        this.http
            .post<Object>(
                type == 'invoice'
                    ? `${this.BASE_URL}${urlInvoice}`
                    : `${this.BASE_URL}${url}`,
                {}
            )
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const customData = {
                        ...response?.['data'],
                        ...(response?.['data']?.reference ||
                        response?.['data']?.facture?.reference
                            ? {
                                  ...(response?.['data']?.facture?.reference
                                      ? {
                                            numero_demande:
                                                response?.['data']?.facture
                                                    ?.reference,
                                            etat_paiement:
                                                response?.['data']?.facture
                                                    ?.statut,
                                        }
                                      : {
                                            numero_demande:
                                                response?.['data']?.reference,
                                            etat_paiement:
                                                response?.['data']?.statut,
                                        }),
                                  ...response?.['data']?.facture,
                                  type_form: 'invoice',
                              }
                            : {
                                  type_form: 'proforma',
                              }),
                    };
                    console.log('customData', customData);

                    this.detailsDemandSubject.next(customData);
                    this.apiResponseDetailsDemandSubject.next(response);
                    this.lastRequestDetailsDemandSubject.next({});
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching detailsDemand', error);
                    return of([]);
                }),
                finalize(() => this.loadingDetailsDemandSubject.next(false))
            )
            .subscribe();
    }

    getDetailsDemand(): Observable<DetailsDemand> {
        return this.detailsDemandSubject.asObservable();
    }
    getDetailsDemandPagination(): any {
        return this.detailsDemandPagination.asObservable();
    }

    isLoadingDetailsDemand(): Observable<boolean> {
        return this.loadingDetailsDemandSubject.asObservable();
    }

    getLastRequestDetailsDemand(): Observable<any> {
        return this.lastRequestDetailsDemandSubject.asObservable();
    }

    getApiResponseDetailsDemand(): Observable<Object> {
        return this.apiResponseDetailsDemandSubject.asObservable();
    }

    /*********************Méthode pour récupérer le prix d'une demande*************** */

    private demandPriceSubject = new BehaviorSubject<number>(0);
    private loadingDemandPriceSubject = new BehaviorSubject<boolean>(false);

    fetchDemandPrice(demand: string): void {
        if (this.loadingDemandPriceSubject.getValue()) return; // Évite les doublons

        const url: string =
            EndPointUrl.GET_CONTRATS_SLA_ENGAGEMENTS_SLA.replace(
                '{demand}',
                demand
            );
        this.loadingDemandPriceSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.demandPriceSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching demandPrice', error);
                    return of([]);
                }),
                finalize(() => this.loadingDemandPriceSubject.next(false))
            )
            .subscribe();
    }

    getDemandPrice(): Observable<number> {
        return this.demandPriceSubject.asObservable();
    }

    isLoadingDemandPrice(): Observable<boolean> {
        return this.loadingDemandPriceSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des détails demands*************** */

    private simDemandSubject = new BehaviorSubject<SimDemand[]>([]);
    private simDemandPagination = new BehaviorSubject<any>(null);
    private loadingSimDemandSubject = new BehaviorSubject<boolean>(false);
    private lastRequestSimDemandSubject = new BehaviorSubject<any>(null);
    private apiResponseSimDemandSubject = new BehaviorSubject<any>(null);
    private dataFilterSimDemandSubject = new BehaviorSubject<any>({});

    fetchSimDemand(data: Object, nbrPage: string = '1'): void {
        if (this.loadingSimDemandSubject.getValue()) return;

        const url: string =
            EndPointUrl.PATRIMOINE_SIM_TRANSACTIONS_ALL_PAGE.replace(
                '{page}',
                nbrPage
            );
        this.loadingSimDemandSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.simDemandSubject.next(response?.['data']?.data);
                    this.simDemandPagination.next(response?.['data']);
                    this.apiResponseSimDemandSubject.next(response);
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

    getSimDemand(): Observable<SimDemand[]> {
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

    /*********************Méthode pour récupérer la liste des clients*************** */

    private applicantsSubject = new BehaviorSubject<any[]>([]);
    private loadingApplicantsSubject = new BehaviorSubject<boolean>(false);
    private apiResponseApplicantsSubject = new BehaviorSubject<any>(null);

    fetchApplicants(): void {
        if (this.loadingApplicantsSubject.getValue()) return;

        const url: string = EndPointUrl.GET_ALL_USERS;
        this.loadingApplicantsSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const formatData = response?.['data'].map((user) => ({
                        ...user,
                        fullName: `${user.nom} ${user.prenoms}`,
                    }));
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

    getApplicants(): Observable<any[]> {
        return this.applicantsSubject.asObservable();
    }

    isLoadingApplicants(): Observable<boolean> {
        return this.loadingApplicantsSubject.asObservable();
    }

    getApiResponseApplicants(): Observable<Object> {
        return this.apiResponseApplicantsSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des usages*************** */

    private usagesSubject = new BehaviorSubject<any[]>([]);
    private loadingUsagesSubject = new BehaviorSubject<boolean>(false);

    fetchUsages(): void {
        if (this.loadingUsagesSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.PATRIMONY_SIM_SIMS_ALL_USAGES;
        this.loadingUsagesSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.usagesSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching usages', error);
                    return of([]);
                }),
                finalize(() => this.loadingUsagesSubject.next(false))
            )
            .subscribe();
    }

    getUsages(): Observable<any[]> {
        return this.usagesSubject.asObservable();
    }

    isLoadingUsages(): Observable<boolean> {
        return this.loadingUsagesSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des formules*************** */

    private formulasSubject = new BehaviorSubject<Array<FormulasInterface>>([]);
    private loadingFormulasSubject = new BehaviorSubject<boolean>(false);

    fetchFormulas(): void {
        if (this.loadingFormulasSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.GET_ALL_FORMULES;
        this.loadingFormulasSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.formulasSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching formulas', error);
                    return of([]);
                }),
                finalize(() => this.loadingFormulasSubject.next(false))
            )
            .subscribe();
    }

    getFormulas(): Observable<Array<FormulasInterface>> {
        return this.formulasSubject.asObservable();
    }

    isLoadingFormulas(): Observable<boolean> {
        return this.loadingFormulasSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des niveaux uns*************** */

    private firstLevelSubject = new BehaviorSubject<Array<FirstLevelInterface>>(
        []
    );
    private loadingFirstLevelSubject = new BehaviorSubject<boolean>(false);

    fetchFirstLevel(): void {
        if (this.loadingFirstLevelSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.GET_ALL_NIVEAUX_1_SIMPLE;
        this.loadingFirstLevelSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.firstLevelSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching firstLevel', error);
                    return of([]);
                }),
                finalize(() => this.loadingFirstLevelSubject.next(false))
            )
            .subscribe();
    }

    getFirstLevel(): Observable<Array<FirstLevelInterface>> {
        return this.firstLevelSubject.asObservable();
    }

    isLoadingFirstLevel(): Observable<boolean> {
        return this.loadingFirstLevelSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des niveaux trois*************** */

    private thirdLevelSubject = new BehaviorSubject<Array<ThirdLevelInterface>>(
        []
    );
    private loadingThirdLevelSubject = new BehaviorSubject<boolean>(false);

    fetchThirdLevel(): void {
        if (this.loadingThirdLevelSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.GET_ALL_NIVEAUX_3_SIMPLE;
        this.loadingThirdLevelSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.thirdLevelSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching thirdLevel', error);
                    return of([]);
                }),
                finalize(() => this.loadingThirdLevelSubject.next(false))
            )
            .subscribe();
    }

    getThirdLevel(): Observable<Array<ThirdLevelInterface>> {
        return this.thirdLevelSubject.asObservable();
    }

    isLoadingThirdLevel(): Observable<boolean> {
        return this.loadingThirdLevelSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des APN*************** */

    private apnSubject = new BehaviorSubject<Array<ApnInterface>>([]);
    private loadingApnSubject = new BehaviorSubject<boolean>(false);

    fetchApn(): void {
        if (this.loadingApnSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.GET_ALL_APN;
        this.loadingApnSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.apnSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching apn', error);
                    return of([]);
                }),
                finalize(() => this.loadingApnSubject.next(false))
            )
            .subscribe();
    }

    getApn(): Observable<Array<ApnInterface>> {
        return this.apnSubject.asObservable();
    }

    isLoadingApn(): Observable<boolean> {
        return this.loadingApnSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des usages*************** */

    private whiteSimCardAvailableSubject = new BehaviorSubject<any[]>([]);
    private totalLotWhiteSimCardAvailableSubject = new BehaviorSubject<number>(
        0
    );
    private loadingWhiteSimCardAvailableSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchWhiteSimCardAvailable(): void {
        if (this.loadingWhiteSimCardAvailableSubject.getValue()) return; // Évite les doublons

        const url: string =
            EndPointUrl.POST_PATRIMOINE_SIM_CARTON_SIM_BLANCHES_DISPONIBLES;
        this.loadingWhiteSimCardAvailableSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.whiteSimCardAvailableSubject.next(
                        response?.data?.data.map((whiteSimCard) => {
                            return { ...whiteSimCard, selected_nb_restants: 0 };
                        })
                    );
                    this.totalLotWhiteSimCardAvailableSubject.next(
                        response?.['data'].total_disponibles
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching whiteSimCardAvailable',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingWhiteSimCardAvailableSubject.next(false)
                )
            )
            .subscribe();
    }

    getWhiteSimCardAvailable(): Observable<any[]> {
        return this.whiteSimCardAvailableSubject.asObservable();
    }

    getTotalLotWhiteSimCardAvailable(): Observable<number> {
        return this.totalLotWhiteSimCardAvailableSubject.asObservable();
    }

    isLoadingWhiteSimCardAvailable(): Observable<boolean> {
        return this.loadingWhiteSimCardAvailableSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des niveaux deux*************** */

    private secondLevelSubject = new BehaviorSubject<any[]>([]);
    private loadingSecondLevelSubject = new BehaviorSubject<boolean>(false);

    fetchSecondLevel(firstLevelLibelIndex: string): void {
        if (this.loadingSecondLevelSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.GET_ALL_NIVEAUX_2_SIMPLE;
        this.loadingSecondLevelSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, firstLevelLibelIndex)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.secondLevelSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching secondLevel', error);
                    return of([]);
                }),
                finalize(() => this.loadingSecondLevelSubject.next(false))
            )
            .subscribe();
    }

    getSecondLevel(): Observable<any[]> {
        return this.secondLevelSubject.asObservable();
    }

    isLoadingSecondLevel(): Observable<boolean> {
        return this.loadingSecondLevelSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des Banks*************** */

    private banksSubject = new BehaviorSubject<Array<BankInterface>>([]);
    private loadingBanksSubject = new BehaviorSubject<boolean>(false);

    fetchBanks(): void {
        if (this.loadingBanksSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.BANKS_ALL;
        this.loadingBanksSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.banksSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching banks', error);
                    return of([]);
                }),
                finalize(() => this.loadingBanksSubject.next(false))
            )
            .subscribe();
    }

    getBanks(): Observable<Array<BankInterface>> {
        return this.banksSubject.asObservable();
    }

    isLoadingBanks(): Observable<boolean> {
        return this.loadingBanksSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des Banks bénéficiaire*************** */

    private banksBenefitSubject = new BehaviorSubject<
        Array<BankBenefitInterface>
    >([]);
    private loadingBanksBenefitSubject = new BehaviorSubject<boolean>(false);

    fetchBanksBenefit(): void {
        if (this.loadingBanksBenefitSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.BANKS_BENEFIT_ALL;
        this.loadingBanksBenefitSubject.next(true);

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.banksBenefitSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching banksBenefit', error);
                    return of([]);
                }),
                finalize(() => this.loadingBanksBenefitSubject.next(false))
            )
            .subscribe();
    }

    getBanksBenefit(): Observable<Array<BankBenefitInterface>> {
        return this.banksBenefitSubject.asObservable();
    }

    isLoadingBanksBenefit(): Observable<boolean> {
        return this.loadingBanksBenefitSubject.asObservable();
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

    PostForceVenteCommercialAll(data: Object): Observable<any> {
        const url: string = <string>EndPointUrl.FORCE_VENTE_COMMERCIAL_ALL;
        return this.http.post(`${this.BASE_URL}${url}`, data);
    }

    PostGestionTenantsPortefeuillesTenantAll(
        data: Object,
        nbrPage: string
    ): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_GESTION_TENANTS_PORTEFEUILLES_TENANT_ALL.replace(
                '${nbrPage}',
                nbrPage
            )
        );
        return this.http.post(`${this.BASE_URL}${url}`, data);
    }

    /*********************Méthode pour récupérer la liste des notifications*************** */

    private notificationListSubject = new BehaviorSubject<
        Array<notificationsCenterInterface>
    >([]);
    private notificationCountSubject = new BehaviorSubject<number>(0);
    private loadingNotificationSubject = new BehaviorSubject<boolean>(false);
    private notificationPaginationSubject = new BehaviorSubject<
        Paginate<notificationsCenterApiResponseInterface>
    >({} as Paginate<notificationsCenterApiResponseInterface>);

    fetchNotification(page: string = '1'): void {
        if (this.loadingNotificationSubject.getValue()) return;

        const url: string = EndPointUrl.GET_ALL_NOTIFICATIONS.replace(
            '{page}',
            page
        );
        this.loadingNotificationSubject.next(true);
        this.http
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const paginationData: Paginate<any> = response?.['data'];
                    this.notificationListSubject.next(response?.['data']?.data);
                    this.notificationCountSubject.next(paginationData.total);
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

    getNotificationList(): Observable<Array<notificationsCenterInterface>> {
        return this.notificationListSubject.asObservable();
    }

    getNotificationCount(): Observable<number> {
        return this.notificationCountSubject.asObservable();
    }

    isLoadingNotification(): Observable<boolean> {
        return this.loadingNotificationSubject.asObservable();
    }
    getNotificationPagination(): Observable<
        Paginate<notificationsCenterApiResponseInterface>
    > {
        return this.notificationPaginationSubject.asObservable();
    }
}
