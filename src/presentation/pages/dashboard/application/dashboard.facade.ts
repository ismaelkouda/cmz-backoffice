import { inject, Injectable } from '@angular/core';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { LoadDashboardStatisticsUseCase } from '@pages/dashboard/domain/use-cases/dashboard.use-case';
import { DashboardPeriodFilter } from '@pages/dashboard/domain/value-objects/dashboard-period-filter.vo';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacade extends ObjectBaseFacade<DashboardStatistics, DashboardPeriodFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(LoadDashboardStatisticsUseCase);

    readonly statistics$ = this.items$;

    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    loadStatistics(period: number): void {
        const filter = DashboardPeriodFilter.create(period);
        const hasData = this.itemsSubject.getValue() != null;
        if (!shouldFetch(false, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilter(filter, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);
    }
}
