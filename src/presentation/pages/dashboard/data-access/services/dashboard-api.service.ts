import { EnvService } from '../../../../../shared/services/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DashboardEndpointEnum } from './../enums/dashboard-endpoint.enum';

@Injectable()
export class DashboardApiService {
    public BASE_URL: string;

    constructor(
        private http: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste des statistiques du tableau de bord*************** */

    private dashboardStatisticSubject = new BehaviorSubject<Object>({});
    private loadingDashboardStatisticSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchDashboardStatistic(): void {
        if (this.loadingDashboardStatisticSubject.getValue()) return;

        const url: string = DashboardEndpointEnum.DASHBOARD_STATISTICS;
        this.loadingDashboardStatisticSubject.next(true);

        this.http
            .get<Object>(`${this.BASE_URL}${url}`)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const formatData = response?.['data'];
                    this.dashboardStatisticSubject.next(formatData);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching applicants', error);
                    return of([]);
                }),
                finalize(() =>
                    this.loadingDashboardStatisticSubject.next(false)
                )
            )
            .subscribe();
    }

    getDashboardStatistic(): Observable<{}> {
        return this.dashboardStatisticSubject.asObservable();
    }

    isLoadingDashboardStatistic(): Observable<boolean> {
        return this.loadingDashboardStatisticSubject.asObservable();
    }
}
