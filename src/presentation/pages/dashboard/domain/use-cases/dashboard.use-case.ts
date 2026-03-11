import { Injectable } from '@angular/core';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardFilterVo } from '@pages/dashboard/domain/value-objects/dashboard-filter.vo';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadDashboardStatisticsUseCase {
    constructor(private readonly dashboardRepository: DashboardRepository) {}

    execute(filter: DashboardFilterVo): Observable<DashboardEntity> {
        return this.dashboardRepository.execute(filter);
    }
}
