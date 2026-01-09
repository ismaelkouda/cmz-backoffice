import { Injectable } from '@angular/core';
import { DashboardResponseDto } from '@pages/dashboard/data/dtos/dashboard-response.dto';
import { DashboardMapper } from '@pages/dashboard/data/mappers/dashboard.mapper';
import { DashboardApi } from '@pages/dashboard/data/sources/dashboard.api';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardPeriodFilter } from '@pages/dashboard/domain/value-objects/dashboard-period-filter.vo';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardRepositoryImpl extends DashboardRepository {
    constructor(
        private readonly api: DashboardApi,
        private readonly mapper: DashboardMapper,
    ) {
        super();
    }

    override loadStatistics(
        filter: DashboardPeriodFilter
    ): Observable<DashboardStatistics> {
        return this.api.loadStatistics(filter).pipe(
            map((response: DashboardResponseDto) =>
                this.mapper.mapFromDto(response)
            )
        );
    }
}
