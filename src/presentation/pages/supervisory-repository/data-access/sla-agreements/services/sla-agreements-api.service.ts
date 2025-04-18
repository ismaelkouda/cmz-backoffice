import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { slaAgreementsEndpointEnum } from '../enums/sla-agreements-endpoint.enum';
import {
    slaAgreementsApiResponseInterface,
    slaAgreementsInterface,
} from '../interfaces/sla-agreements.interface';

@Injectable()
export class SlaAgreementsApiService {
    private slaAgreementsSubject = new BehaviorSubject<
        Array<slaAgreementsInterface>
    >([]);
    private slaAgreementsSelected = new BehaviorSubject<slaAgreementsInterface>(
        {} as slaAgreementsInterface
    );
    private loadingSlaAgreementsSubject = new BehaviorSubject<boolean>(false);
    private apiResponseSlaAgreementsSubject =
        new BehaviorSubject<slaAgreementsApiResponseInterface>(
            {} as slaAgreementsApiResponseInterface
        );

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste slaAgreements*************** */
    fetchSlaAgreements(): void {
        if (this.loadingSlaAgreementsSubject.getValue()) return;
        this.loadingSlaAgreementsSubject.next(true);
        const url: string =
            slaAgreementsEndpointEnum.SUPERVISION_OPERATIONS_ENGAGEMENTS_SLA_ALL;

        this.http
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const slaAgreements = response?.data;
                    this.slaAgreementsSubject.next(slaAgreements);
                    this.apiResponseSlaAgreementsSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching slaAgreements', error);
                    return of([]);
                }),
                finalize(() => this.loadingSlaAgreementsSubject.next(false))
            )
            .subscribe();
    }

    getSlaAgreements(): Observable<Array<slaAgreementsInterface>> {
        return this.slaAgreementsSubject.asObservable();
    }
    isLoadingSlaAgreements(): Observable<boolean> {
        return this.loadingSlaAgreementsSubject.asObservable();
    }
    getApiResponseSlaAgreements(): Observable<Object> {
        return this.apiResponseSlaAgreementsSubject.asObservable();
    }
    getSlaAgreementsSelected(): Observable<slaAgreementsInterface> {
        return this.slaAgreementsSelected.asObservable();
    }
    setSlaAgreementsSelected(slaAgreements: slaAgreementsInterface): void {
        this.slaAgreementsSelected.next(slaAgreements);
    }
}
