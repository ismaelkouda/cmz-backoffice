import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { indicatorsAlarmsEndpointEnum } from '../enums/indicators-alarms-endpoint.enum';
import {
    indicatorsAlarmsApiResponseInterface,
    indicatorsAlarmsInterface,
} from '../interfaces/indicators-alarms.interface';

@Injectable()
export class IndicatorsAlarmsApiService {
    private indicatorsAlarmsSubject = new BehaviorSubject<
        Array<indicatorsAlarmsInterface>
    >([]);
    private indicatorsAlarmsSelected =
        new BehaviorSubject<indicatorsAlarmsInterface>(
            {} as indicatorsAlarmsInterface
        );
    private loadingIndicatorsAlarmsSubject = new BehaviorSubject<boolean>(
        false
    );
    private apiResponseIndicatorsAlarmsSubject =
        new BehaviorSubject<indicatorsAlarmsApiResponseInterface>(
            {} as indicatorsAlarmsApiResponseInterface
        );

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste indicatorsAlarms*************** */
    fetchIndicatorsAlarms(): void {
        if (this.loadingIndicatorsAlarmsSubject.getValue()) return;
        this.loadingIndicatorsAlarmsSubject.next(true);
        const url: string =
            indicatorsAlarmsEndpointEnum.PROFIL_SUPERVISION_REFERENTIEL_TELEMETRIQUES_ALL;

        this.http
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const indicatorsAlarms = response?.data;
                    this.indicatorsAlarmsSubject.next(indicatorsAlarms);
                    this.apiResponseIndicatorsAlarmsSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching indicatorsAlarms', error);
                    return of([]);
                }),
                finalize(() => this.loadingIndicatorsAlarmsSubject.next(false))
            )
            .subscribe();
    }

    getIndicatorsAlarms(): Observable<Array<indicatorsAlarmsInterface>> {
        return this.indicatorsAlarmsSubject.asObservable();
    }
    isLoadingIndicatorsAlarms(): Observable<boolean> {
        return this.loadingIndicatorsAlarmsSubject.asObservable();
    }
    getApiResponseIndicatorsAlarms(): Observable<Object> {
        return this.apiResponseIndicatorsAlarmsSubject.asObservable();
    }
    getIndicatorsAlarmsSelected(): Observable<indicatorsAlarmsInterface> {
        return this.indicatorsAlarmsSelected.asObservable();
    }
    setIndicatorsAlarmsSelected(
        indicatorsAlarms: indicatorsAlarmsInterface
    ): void {
        this.indicatorsAlarmsSelected.next(indicatorsAlarms);
    }
}
