import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardPeriodFilter } from '@pages/dashboard/domain/value-objects/dashboard-period-filter.vo';
import { DashboardResponseDto } from '@pages/dashboard/data/dtos/dashboard-response.dto';
import { DashboardMapper } from '@pages/dashboard/data/mappers/dashboard.mapper';
import { DashboardApi } from '@pages/dashboard/data/sources/dashboard.api';

@Injectable({ providedIn: 'root' })
export class DashboardRepositoryImpl extends DashboardRepository {
    constructor(
        private readonly api: DashboardApi,
        private readonly mapper: DashboardMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    override loadStatistics(
        filter: DashboardPeriodFilter
    ): Observable<DashboardStatistics> {
        return this.api.loadStatistics(filter.toQueryParams()).pipe(
            map((response: DashboardResponseDto) =>
                this.mapper.mapFromDto(response)
            ),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'DASHBOARD.MESSAGES.ERROR.UNABLE_TO_LOAD_STATISTICS'
                                  )
                        )
                )
            )
        );
    }
}
