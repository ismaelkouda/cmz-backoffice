import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardFilterDto } from '@presentation/pages/dashboard/application/dto/dashboard-filter.dto';
import { DashboardFilterEntity } from '@presentation/pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';
import { DashboardRepository } from '@presentation/pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardFilterVo } from '@presentation/pages/dashboard/domain/value-objects/dashboard-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class DashboardUseCase {
    private readonly repository = inject(DashboardRepository);

    execute(filterDto: DashboardFilterDto): Observable<DashboardEntity> {
        const vo = DashboardFilterVo.fromDto(filterDto);
        const filter = DashboardFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
