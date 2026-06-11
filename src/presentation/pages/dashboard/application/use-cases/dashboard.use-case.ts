import { inject, Injectable } from '@angular/core';
import { DashboardFilterDto } from '@pages/dashboard/application/dto/dashboard-filter.dto';
import { DashboardFilterEntity } from '@pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardFilterVo } from '@pages/dashboard/domain/value-objects/dashboard-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardUseCase {
    private readonly repository = inject(DashboardRepository);

    execute(
        filterDto: DashboardFilterDto,
        options?: FetchOptions
    ): Observable<DashboardEntity> {
        const vo = DashboardFilterVo.fromDto(filterDto);
        const filter = DashboardFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
