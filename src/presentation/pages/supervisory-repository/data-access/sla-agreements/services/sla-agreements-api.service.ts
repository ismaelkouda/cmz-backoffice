import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { EnvService } from '../../../../../../shared/services/env.service';
import { SlaAgreementsEndpointEnum } from '../enums/sla-agreements-endpoint.enum';
import {
    SlaAgreementsApiResponseInterface,
    SlaAgreementsInterface,
} from '../interfaces/sla-agreements.interface';

@Injectable()
export class SlaAgreementsApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    private slaAgreementsSubject = new BehaviorSubject<
        SlaAgreementsInterface[]
    >([]);
    private loadingSlaAgreementsSubject = new BehaviorSubject<boolean>(false);
    private apiResponseSlaAgreementsSubject =
        new BehaviorSubject<SlaAgreementsApiResponseInterface>(
            {} as SlaAgreementsApiResponseInterface
        );
    fetchSlaAgreements(): void {
        if (this.loadingSlaAgreementsSubject.getValue()) {
            return;
        }
        this.loadingSlaAgreementsSubject.next(true);
        const url: string =
            SlaAgreementsEndpointEnum.SUPERVISORY_REFERENCE_SLA_AGREEMENTS;

        this.httpClient
            .post<object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const slaAgreements = response?.['data'];
                    this.slaAgreementsSubject.next(slaAgreements);
                    this.apiResponseSlaAgreementsSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingSlaAgreementsSubject.next(false))
            )
            .subscribe();
    }

    getSlaAgreements(): Observable<SlaAgreementsInterface[]> {
        return this.slaAgreementsSubject.asObservable();
    }
    isLoadingSlaAgreements(): Observable<boolean> {
        return this.loadingSlaAgreementsSubject.asObservable();
    }
    getApiResponseSlaAgreements(): Observable<SlaAgreementsApiResponseInterface> {
        return this.apiResponseSlaAgreementsSubject.asObservable();
    }
}
