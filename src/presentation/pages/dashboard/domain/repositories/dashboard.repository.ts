import { Observable } from 'rxjs';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { DashboardPeriodFilter } from '@pages/dashboard/domain/value-objects/dashboard-period-filter.vo';

export abstract class DashboardRepository {
    abstract loadStatistics(
        filter: DashboardPeriodFilter
    ): Observable<DashboardStatistics>;
}
