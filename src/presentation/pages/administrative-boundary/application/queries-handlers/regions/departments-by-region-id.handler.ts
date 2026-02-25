import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsByRegionIdQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';
import { DepartmentsByRegionIdUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/regions/departments-by-region-id.use-case';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdHandler {
    private readonly useCase = inject(DepartmentsByRegionIdUseCase);

    execute(
        command: DepartmentsByRegionIdQuery,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        return this.useCase.execute(
            {
                uniqId: command.uniqId,
                search: command.search,
                municipality: command.municipality,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
