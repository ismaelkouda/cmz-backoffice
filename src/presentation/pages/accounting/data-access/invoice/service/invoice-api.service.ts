import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { EnvService } from '../../../../../../shared/services/env.service';
import { invoiceEndpointEnum } from '../enums/invoice-endpoint.enum';
import { InvoiceFilterInterface } from '../interface/invoice-filter.interface';
import {
    invoiceApiResponseInterface,
    InvoiceInterface,
} from '../interface/invoice.interface';

@Injectable()
export class InvoiceApiService {
    private invoiceSubject = new BehaviorSubject<Array<InvoiceInterface>>([]);
    private invoicePagination = new BehaviorSubject<Paginate<InvoiceInterface>>(
        {} as Paginate<InvoiceInterface>
    );
    private loadingInvoiceSubject = new BehaviorSubject<boolean>(false);
    private dataFilterInvoiceSubject =
        new BehaviorSubject<InvoiceFilterInterface>(
            {} as InvoiceFilterInterface
        );
    private dataNbrPageInvoiceSubject = new BehaviorSubject<string>('1');
    private apiResponseInvoiceSubject =
        new BehaviorSubject<invoiceApiResponseInterface>(
            {} as invoiceApiResponseInterface
        );

    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    /*********************Méthode pour récupérer la liste invoice*************** */
    fetchInvoice(data: InvoiceFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingInvoiceSubject.getValue()) return;
        this.loadingInvoiceSubject.next(true);
        const url: string = invoiceEndpointEnum.POST_MANAGEMENT_PAYMENT.replace(
            '{page}',
            nbrPage
        );

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const invoice = response?.['data']?.data?.data;
                    this.invoiceSubject.next(invoice);
                    this.invoicePagination.next(response?.['data']?.data);
                    this.apiResponseInvoiceSubject.next(response);
                    this.dataFilterInvoiceSubject.next(data);
                    this.dataNbrPageInvoiceSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching invoice', error);
                    return of([]);
                }),
                finalize(() => this.loadingInvoiceSubject.next(false))
            )
            .subscribe();
    }

    getInvoice(): Observable<Array<InvoiceInterface>> {
        return this.invoiceSubject.asObservable();
    }
    getInvoicePagination(): Observable<Paginate<InvoiceInterface>> {
        return this.invoicePagination.asObservable();
    }
    isLoadingInvoice(): Observable<boolean> {
        return this.loadingInvoiceSubject.asObservable();
    }
    getDataFilterInvoice(): Observable<InvoiceFilterInterface> {
        return this.dataFilterInvoiceSubject.asObservable();
    }
    getDataNbrPageInvoice(): Observable<string> {
        return this.dataNbrPageInvoiceSubject.asObservable();
    }
    getApiResponseInvoice(): Observable<invoiceApiResponseInterface> {
        return this.apiResponseInvoiceSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des SIMS details*************** */

    // private invoiceDetailsSubject = new BehaviorSubject<invoiceDetailsInterface>({} as invoiceDetailsInterface);
    // private loadingInvoiceDetailsSubject = new BehaviorSubject<boolean>(false);

    // fetchInvoiceDetails(numeroDemande: string): void {
    //     if (this.loadingInvoiceDetailsSubject.getValue()) return;

    //     const url: string = invoiceEndpointEnum.POST_MANAGEMENT_PAYMENT_DETAILS.replace('{numeroDemande}', numeroDemande);
    //     this.loadingInvoiceDetailsSubject.next(true);

    //     this.httpClient
    //         .post<Object>(`${this.BASE_URL}${url}`, {})
    //         .pipe(
    //             debounceTime(1000),
    //             switchMap((response: any) => {
    //                 this.invoiceDetailsSubject.next(response?.['data']);
    //                 return of(response);
    //             }),
    //             catchError((error) => {
    //                 console.error('Error fetching invoiceDetails', error);
    //                 return of([]);
    //             }),
    //             finalize(() => this.loadingInvoiceDetailsSubject.next(false))
    //         )
    //         .subscribe();
    // }

    // getInvoiceDetails(): Observable<invoiceDetailsInterface> {
    //     return this.invoiceDetailsSubject.asObservable();
    // }

    // isLoadingInvoiceDetails(): Observable<boolean> {
    //     return this.loadingInvoiceDetailsSubject.asObservable();
    // }
}
