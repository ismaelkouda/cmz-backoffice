import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardPeriodFilter } from '@pages/dashboard/domain/value-objects/dashboard-period-filter.vo';

@Injectable({ providedIn: 'root' })
export class LoadDashboardStatisticsUseCase {
    constructor(
        private readonly dashboardRepository: DashboardRepository
    ) {}

    execute(filter: DashboardPeriodFilter): Observable<DashboardStatistics> {
        return this.dashboardRepository.loadStatistics(filter);
    }
}

