import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { paymentEndpointEnum } from '../enums/payment-endpoint.enum';
import {
    paymentApiResponseInterface,
    paymentGlobalStatsInterface,
    paymentInterface,
} from '../interface/payment.interface';
import { paymentFilterInterface } from '../interface/payment-filter.interface';

@Injectable()
export class PaymentApiService {
    private paymentSubject = new BehaviorSubject<Array<paymentInterface>>([]);
    private paymentGlobalState =
        new BehaviorSubject<paymentGlobalStatsInterface>(
            {} as paymentGlobalStatsInterface
        );
    private paymentPagination = new BehaviorSubject<Paginate<paymentInterface>>(
        {} as Paginate<paymentInterface>
    );
    private paymentSelected = new BehaviorSubject<paymentInterface>(
        {} as paymentInterface
    );
    private loadingPaymentSubject = new BehaviorSubject<boolean>(false);
    private dataFilterPaymentSubject =
        new BehaviorSubject<paymentFilterInterface>(
            {} as paymentFilterInterface
        );
    private dataNbrPagePaymentSubject = new BehaviorSubject<string>('1');
    private apiResponsePaymentSubject =
        new BehaviorSubject<paymentApiResponseInterface>(
            {} as paymentApiResponseInterface
        );

    private BASE_URL: string;
    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste payment*************** */
    fetchPayment(data: paymentFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingPaymentSubject.getValue()) return;
        this.loadingPaymentSubject.next(true);
        const url: string = paymentEndpointEnum.POST_MANAGEMENT_PAYMENT.replace(
            '{page}',
            nbrPage
        );

        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const payment = response?.['data']?.data?.data;
                    this.paymentSubject.next(payment);
                    this.paymentPagination.next(response?.['data']?.data);
                    this.paymentGlobalState.next(response?.['data']);
                    this.apiResponsePaymentSubject.next(response);
                    this.dataFilterPaymentSubject.next(data);
                    this.dataNbrPagePaymentSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching payment', error);
                    return of([]);
                }),
                finalize(() => this.loadingPaymentSubject.next(false))
            )
            .subscribe();
    }

    getPayment(): Observable<Array<paymentInterface>> {
        return this.paymentSubject.asObservable();
    }
    getPaymentPagination(): Observable<Paginate<paymentInterface>> {
        return this.paymentPagination.asObservable();
    }
    getPaymentGlobalState(): Observable<paymentGlobalStatsInterface> {
        return this.paymentGlobalState.asObservable();
    }
    isLoadingPayment(): Observable<boolean> {
        return this.loadingPaymentSubject.asObservable();
    }
    getDataFilterPayment(): Observable<paymentFilterInterface> {
        return this.dataFilterPaymentSubject.asObservable();
    }
    getDataNbrPagePayment(): Observable<string> {
        return this.dataNbrPagePaymentSubject.asObservable();
    }
    getApiResponsePayment(): Observable<paymentApiResponseInterface> {
        return this.apiResponsePaymentSubject.asObservable();
    }
    getPaymentSelected(): Observable<paymentInterface> {
        return this.paymentSelected.asObservable();
    }
    setPaymentSelected(payment: paymentInterface): void {
        this.paymentSelected.next(payment);
    }

    /*********************Méthode pour récupérer la liste des SIMS details*************** */

    // private paymentDetailsSubject = new BehaviorSubject<paymentDetailsInterface>({} as paymentDetailsInterface);
    // private loadingPaymentDetailsSubject = new BehaviorSubject<boolean>(false);

    // fetchPaymentDetails(numeroDemande: string): void {
    //     if (this.loadingPaymentDetailsSubject.getValue()) return;

    //     const url: string = paymentEndpointEnum.POST_MANAGEMENT_PAYMENT_DETAILS.replace('{numeroDemande}', numeroDemande);
    //     this.loadingPaymentDetailsSubject.next(true);

    //     this.httpClient
    //         .post<Object>(`${this.BASE_URL}${url}`, {})
    //         .pipe(
    //             debounceTime(1000),
    //             switchMap((response: any) => {
    //                 this.paymentDetailsSubject.next(response?.['data']);
    //                 return of(response);
    //             }),
    //             catchError((error) => {
    //                 console.error('Error fetching paymentDetails', error);
    //                 return of([]);
    //             }),
    //             finalize(() => this.loadingPaymentDetailsSubject.next(false))
    //         )
    //         .subscribe();
    // }

    // getPaymentDetails(): Observable<paymentDetailsInterface> {
    //     return this.paymentDetailsSubject.asObservable();
    // }

    // isLoadingPaymentDetails(): Observable<boolean> {
    //     return this.loadingPaymentDetailsSubject.asObservable();
    // }
}
