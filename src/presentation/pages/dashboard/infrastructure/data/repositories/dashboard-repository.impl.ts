import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DashboardFilterEntity } from '@presentation/pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';
import { DashboardRepository } from '@presentation/pages/dashboard/domain/repositories/dashboard.repository';
import { dashboardFilterMapper } from '@presentation/pages/dashboard/infrastructure/data/mappers/dashboard-filter.mapper';
import { DashboardMapper } from '@presentation/pages/dashboard/infrastructure/data/mappers/dashboard.mapper';
import { DashboardApi } from '@presentation/pages/dashboard/infrastructure/data/sources/dashboard.api';

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
