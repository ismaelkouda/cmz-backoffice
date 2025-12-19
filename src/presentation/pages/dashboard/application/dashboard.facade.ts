import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { LoadDashboardStatisticsUseCase } from '@pages/dashboard/domain/use-cases/dashboard.use-case';
import { DashboardPeriodFilter } from '@pages/dashboard/domain/value-objects/dashboard-period-filter.vo';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    finalize,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
    private readonly statisticsSubject =
        new BehaviorSubject<DashboardStatistics | null>(null);
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    private readonly majDateSubject = new BehaviorSubject<string | undefined>(undefined);

    readonly statistics$: Observable<DashboardStatistics | null> =
        this.statisticsSubject.asObservable();
    readonly isLoading$: Observable<boolean> =
        this.loadingSubject.asObservable();
    readonly majDate$: Observable<string | undefined> =
        this.majDateSubject.asObservable();

    constructor(
        private readonly loadStatisticsUseCase: LoadDashboardStatisticsUseCase,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService
    ) { }

    loadStatistics(period?: number): Observable<DashboardStatistics> {
        const filter = DashboardPeriodFilter.create(period);
        this.loadingSubject.next(true);

        return this.loadStatisticsUseCase.execute(filter).pipe(
            tap((statistics) => {
                this.statisticsSubject.next(statistics);
                this.majDateSubject.next(statistics.dateDerniereMaj);
            }),
            finalize(() => this.loadingSubject.next(false)),
            catchError((error: Error) => {
                const errorMessage =
                    this.translateService.instant(error.message) ||
                    error.message;
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
    }
}
