import { Observable, BehaviorSubject, of } from 'rxjs';
import {
    catchError,
    finalize,
    debounceTime,
    switchMap,
    take,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreatmentRequestsServiceFormEndpointEnum } from '../enums/treatment-requests-service-form-endpoint.enum';
import { TreatmentRequestsServiceDetailsInterface } from '../interfaces/treatment-requests-service-form.interface';
import { EnvService } from '../../../../services/env.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TreatmentRequestsServiceFormApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste des details des clients*************** */

    private detailsManagedCustomersSubject =
        new BehaviorSubject<TreatmentRequestsServiceDetailsInterface>(
            {} as TreatmentRequestsServiceDetailsInterface
        );
    private loadingRequestsServiceDetailsSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchRequestsServiceDetails(numberDemand: string, type: any = null): void {
        if (this.loadingRequestsServiceDetailsSubject.getValue()) return;

        const url: string =
            TreatmentRequestsServiceFormEndpointEnum.REQUESTS_SERVICE_DETAILS.replace(
                '{numberDemand}',
                numberDemand
            );
        const urlInvoice: string =
            TreatmentRequestsServiceFormEndpointEnum.INVOICE_DETAILS.replace(
                '{numberDemand}',
                numberDemand
            );

        this.loadingRequestsServiceDetailsSubject.next(true);

        this.httpClient
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
                        numero_dossier: response?.['data']?.numero_demande,
                        ...response?.['data'],
                        ...(response?.['data']?.reference ||
                        response?.['data']?.facture?.reference
                            ? {
                                  ...response?.['data']?.facture,
                                  type_form: 'invoice',

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
                              }
                            : {
                                  type_form: 'proforma',
                                  qte: response?.['data']?.nb_demande_soumises,
                              }),
                    };
                    this.detailsManagedCustomersSubject.next(customData);
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching detailsManagedCustomers',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingRequestsServiceDetailsSubject.next(false)
                )
            )
            .subscribe();
    }

    getRequestsServiceDetails(): Observable<TreatmentRequestsServiceDetailsInterface> {
        return this.detailsManagedCustomersSubject.asObservable();
    }

    isLoadingRequestsServiceDetails(): Observable<boolean> {
        return this.loadingRequestsServiceDetailsSubject.asObservable();
    }

    /*********************Méthode pour valider la mise a jour d'un client *************** */

    private modifyRequestsServiceSubject = new BehaviorSubject<any>({} as any);
    private loadingModifyRequestsServiceSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchModifyRequestsService(
        data: any,
        numberDemand: string,
        toastService: ToastrService,
        fetchCustomers?: () => void,
        goOut?: () => void
    ): void {
        if (this.loadingModifyRequestsServiceSubject.getValue()) return;
        this.loadingModifyRequestsServiceSubject.next(true);
        const url: string =
            TreatmentRequestsServiceFormEndpointEnum.REQUESTS_SERVICE_MODIFY.replace(
                '{numberDemand}',
                numberDemand
            );
        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                take(1),
                debounceTime(1000),
                switchMap((response: any) => {
                    const modifyRequestsService = response;
                    this.modifyRequestsServiceSubject.next(
                        modifyRequestsService
                    );
                    this.handleSuccessFullFetch(
                        response,
                        toastService,
                        fetchCustomers,
                        goOut
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching modifyCustomers', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingModifyRequestsServiceSubject.next(false)
                )
            )
            .subscribe();
    }

    getModifyRequestsService(): Observable<any> {
        return this.modifyRequestsServiceSubject.asObservable();
    }
    isLoadingModifyRequestsService(): Observable<boolean> {
        return this.loadingModifyRequestsServiceSubject.asObservable();
    }

    /*********************Méthode pour valider la mise a jour d'un client *************** */

    private closureRequestsServiceSubject = new BehaviorSubject<any>({} as any);
    private loadingClosureRequestsServiceSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchClosureRequestsService(
        data: any,
        numberDemand: string,
        toastService: ToastrService,
        fetchCustomers?: () => void,
        goOut?: () => void
    ): void {
        if (this.loadingClosureRequestsServiceSubject.getValue()) return;
        this.loadingClosureRequestsServiceSubject.next(true);
        const url: string =
            TreatmentRequestsServiceFormEndpointEnum.REQUESTS_SERVICE_CLOSURE.replace(
                '{numberDemand}',
                numberDemand
            );
        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                take(1),
                debounceTime(1000),
                switchMap((response: any) => {
                    const closureRequestsService = response;
                    this.closureRequestsServiceSubject.next(
                        closureRequestsService
                    );
                    this.handleSuccessFullFetch(
                        response,
                        toastService,
                        fetchCustomers,
                        goOut
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching closure', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingClosureRequestsServiceSubject.next(false)
                )
            )
            .subscribe();
    }

    getClosureRequestsService(): Observable<any> {
        return this.closureRequestsServiceSubject.asObservable();
    }
    isLoadingClosureRequestsService(): Observable<boolean> {
        return this.loadingClosureRequestsServiceSubject.asObservable();
    }

    /*********************Méthode pour valider l'abandon' d'un client *************** */

    private abandonRequestsServiceSubject = new BehaviorSubject<any>({} as any);
    private loadingAbandonRequestsServiceSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchAbandonRequestsService(
        payload,
        numberDemand: string,
        toastService: ToastrService,
        fetchCustomers?: () => void,
        goOut?: () => void
    ): void {
        if (this.loadingAbandonRequestsServiceSubject.getValue()) return;
        this.loadingAbandonRequestsServiceSubject.next(true);
        const url: string =
            TreatmentRequestsServiceFormEndpointEnum.REQUESTS_SERVICE_ABANDON.replace(
                '{numberDemand}',
                numberDemand
            );
        this.httpClient
            .post<Object>(this.BASE_URL + url, payload)
            .pipe(
                take(1),
                debounceTime(1000),
                switchMap((response: any) => {
                    const abandonRequestsService = response;
                    this.abandonRequestsServiceSubject.next(
                        abandonRequestsService
                    );
                    this.handleSuccessFullFetch(
                        response,
                        toastService,
                        fetchCustomers,
                        goOut
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching abandonCustomers', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingAbandonRequestsServiceSubject.next(false)
                )
            )
            .subscribe();
    }

    getAbandonRequestsService(): Observable<any> {
        return this.abandonRequestsServiceSubject.asObservable();
    }
    isLoadingAbandonRequestsService(): Observable<boolean> {
        return this.loadingAbandonRequestsServiceSubject.asObservable();
    }

    handleSuccessFullFetch(
        response: any,
        toastService: ToastrService,
        fetchCustomers?: () => void,
        goOut?: () => void
    ) {
        if (response && response.error === false && toastService) {
            toastService.success(response.message);
            if (goOut) {
                goOut();
            }
            if (fetchCustomers) {
                fetchCustomers();
            }
        } else if (response && response.error === true) {
            toastService.error(response.message);
        }
    }
}
