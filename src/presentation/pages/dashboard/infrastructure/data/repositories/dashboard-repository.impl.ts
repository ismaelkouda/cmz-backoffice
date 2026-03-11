import { inject, Injectable } from '@angular/core';
import { DashboardFilterEntity } from '@pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { dashboardFilterMapper } from '@pages/dashboard/infrastructure/data/mappers/dashboard-filter.mapper';
import { DashboardMapper } from '@pages/dashboard/infrastructure/data/mappers/dashboard.mapper';
import { DashboardApi } from '@pages/dashboard/infrastructure/data/sources/dashboard.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardRepositoryImpl implements DashboardRepository {
    private readonly api = inject(DashboardApi);
    private readonly mapper = inject(DashboardMapper);

    execute(entity: DashboardFilterEntity): Observable<DashboardEntity> {
        const paramsDto = dashboardFilterMapper(entity);
        console.log(
            '🚀 ~ DashboardRepositoryImpl ~ execute ~ paramsDto:',
            paramsDto
        );
        return this.api
            .execute(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
