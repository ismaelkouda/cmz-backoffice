import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
    catchError,
    debounceTime,
    finalize,
    switchMap,
    take,
} from 'rxjs/operators';
import { CustomersActivateFilterInterface } from '../../../../../presentation/pages/requests-service/data-access/customers-activate/interfaces/customers-activate-filter.interface';
import { EnvService } from '../../../../services/env.service';
import { SharedService } from '../../../../services/shared.service';
import { InvoiceFormEndpointEnum } from '../enums/invoice-form-endpoint.enum';
import { InvoiceFormDetailsInterface } from '../interfaces/invoice-form-details.interface';

@Injectable()
export class InvoiceFormApiService {
    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService,
        private sharedService: SharedService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour récupérer la liste des details des clients*************** */

    private detailsManagedCustomersSubject =
        new BehaviorSubject<InvoiceFormDetailsInterface>(
            {} as InvoiceFormDetailsInterface
        );
    private loadingRequestsServiceDetailsSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchRequestsServiceDetails(numberDemand: string, type: any = null): void {
        if (this.loadingRequestsServiceDetailsSubject.getValue()) return;

        const url: string = InvoiceFormEndpointEnum.INVOICE_DETAILS.replace(
            '{numberDemand}',
            numberDemand
        );
        const urlInvoice: string =
            InvoiceFormEndpointEnum.INVOICE_DETAILS.replace(
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

    getRequestsServiceDetails(): Observable<InvoiceFormDetailsInterface> {
        return this.detailsManagedCustomersSubject.asObservable();
    }

    isLoadingRequestsServiceDetails(): Observable<boolean> {
        return this.loadingRequestsServiceDetailsSubject.asObservable();
    }

    /*********************Méthode pour valider pour valider le formulaire de facture *************** */

    private validateProformaServiceSubject = new BehaviorSubject<any>(
        {} as any
    );
    private loadingValidateProformaServiceSubject =
        new BehaviorSubject<boolean>(false);

    fetchValidateProformaService(
        data: any,
        numberDemand: string,
        toastService: ToastrService,
        goOut?: () => void
    ): void {
        if (this.loadingValidateProformaServiceSubject.getValue()) return;
        this.loadingValidateProformaServiceSubject.next(true);
        const url: string =
            InvoiceFormEndpointEnum.VALIDATE_PROFORMA_DETAILS.replace(
                '{numberDemand}',
                numberDemand
            );
        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                take(1),
                debounceTime(1000),
                switchMap((response: any) => {
                    const validateProformaService = response;
                    this.validateProformaServiceSubject.next(
                        validateProformaService
                    );
                    this.handleSuccessFullFetch(response, toastService, goOut);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching validateProforma', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingValidateProformaServiceSubject.next(false)
                )
            )
            .subscribe();
    }

    getValidateProformaService(): Observable<any> {
        return this.validateProformaServiceSubject.asObservable();
    }
    isLoadingValidateProformaService(): Observable<boolean> {
        return this.loadingValidateProformaServiceSubject.asObservable();
    }

    handleSuccessFullFetch(
        response: any,
        toastService: ToastrService,
        goOut?: () => void
    ) {
        if (response && response.error === false && toastService) {
            toastService.success(response.message);
            if (goOut) {
                goOut();
            }

            this.sharedService.fetchCustomersActivate(
                {} as CustomersActivateFilterInterface
            );
        } else if (response && response.error === true) {
            toastService.error(response.message);
        }
    }
}
