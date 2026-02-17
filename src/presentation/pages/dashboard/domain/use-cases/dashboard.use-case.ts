import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';
import { DashboardFilterVo } from '@presentation/pages/dashboard/domain/value-objects/dashboard-filter.vo';

import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';

@Injectable({ providedIn: 'root' })
export class LoadDashboardStatisticsUseCase {
    constructor(private readonly dashboardRepository: DashboardRepository) {}

    execute(filter: DashboardFilterVo): Observable<DashboardEntity> {
        return this.dashboardRepository.execute(filter);
    }
}
