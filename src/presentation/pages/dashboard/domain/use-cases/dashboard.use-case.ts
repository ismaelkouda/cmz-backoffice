import { Injectable, inject } from '@angular/core';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardFilterVo } from '@pages/dashboard/domain/value-objects/dashboard-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadDashboardStatisticsUseCase {
    private readonly dashboardRepository = inject(DashboardRepository);

    execute(
        filter: DashboardFilterVo,
        options?: FetchOptions
    ): Observable<DashboardEntity> {
        return this.dashboardRepository.execute(filter, options);
    }
}
