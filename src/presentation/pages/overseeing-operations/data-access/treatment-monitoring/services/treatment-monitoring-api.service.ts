import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { treatmentMonitoringEndpointEnum } from '../enums/treatment-monitoring-endpoint.enum';
import { TreatmentMonitoringFilterInterface } from '../interfaces/treatment-monitoring-filter.interface';
import {
    TreatmentMonitoringApiResponseInterface,
    TreatmentMonitoringInterface,
} from '../../../../../../shared/interfaces/treatment-monitoring.interface';

@Injectable()
export class TreatmentMonitoringApiService {
    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste treatment-monitoring*************** */

    private treatmentMonitoringSubject = new BehaviorSubject<
        Array<TreatmentMonitoringInterface>
    >([]);
    private treatmentMonitoringPagination = new BehaviorSubject<
        Paginate<TreatmentMonitoringInterface>
    >({} as Paginate<TreatmentMonitoringInterface>);
    private loadingTreatmentMonitoringSubject = new BehaviorSubject<boolean>(
        false
    );
    private dataFilterTreatmentMonitoringSubject =
        new BehaviorSubject<TreatmentMonitoringFilterInterface>(
            {} as TreatmentMonitoringFilterInterface
        );
    private dataNbrPageTreatmentMonitoringSubject = new BehaviorSubject<string>(
        '1'
    );
    private apiResponseTreatmentMonitoringSubject =
        new BehaviorSubject<TreatmentMonitoringApiResponseInterface>(
            {} as TreatmentMonitoringApiResponseInterface
        );
    fetchTreatmentMonitoring(
        data: TreatmentMonitoringFilterInterface,
        nbrPage: string = '1'
    ): void {
        if (this.loadingTreatmentMonitoringSubject.getValue()) return;
        this.loadingTreatmentMonitoringSubject.next(true);
        const url: string =
            treatmentMonitoringEndpointEnum.TREATMENT_MONITORING.replace(
                '{page}',
                nbrPage
            );

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const treatmentMonitoring = response?.['data']?.data.map(
                        (demande) => {
                            return {
                                ...demande,
                                demandeur:
                                    demande.demandeur_nom +
                                    ' ' +
                                    demande.demandeur_prenoms,
                            };
                        }
                    );
                    this.treatmentMonitoringSubject.next(treatmentMonitoring);
                    this.treatmentMonitoringPagination.next(response?.['data']);
                    this.apiResponseTreatmentMonitoringSubject.next(response);
                    this.dataFilterTreatmentMonitoringSubject.next(data);
                    this.dataNbrPageTreatmentMonitoringSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching treatmentMonitoring', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingTreatmentMonitoringSubject.next(false)
                )
            )
            .subscribe();
    }

    getTreatmentMonitoring(): Observable<Array<TreatmentMonitoringInterface>> {
        return this.treatmentMonitoringSubject.asObservable();
    }
    getTreatmentMonitoringPagination(): Observable<
        Paginate<TreatmentMonitoringInterface>
    > {
        return this.treatmentMonitoringPagination.asObservable();
    }
    isLoadingTreatmentMonitoring(): Observable<boolean> {
        return this.loadingTreatmentMonitoringSubject.asObservable();
    }
    getDataFilterTreatmentMonitoring(): Observable<TreatmentMonitoringFilterInterface> {
        return this.dataFilterTreatmentMonitoringSubject.asObservable();
    }
    getDataNbrPageTreatmentMonitoring(): Observable<string> {
        return this.dataNbrPageTreatmentMonitoringSubject.asObservable();
    }
    getApiResponseTreatmentMonitoring(): Observable<TreatmentMonitoringApiResponseInterface> {
        return this.apiResponseTreatmentMonitoringSubject.asObservable();
    }
}
