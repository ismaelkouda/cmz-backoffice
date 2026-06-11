import { inject, Injectable } from '@angular/core';
import { DepartmentsByRegionIdQuery } from '@pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';
import { DepartmentsByRegionIdUseCase } from '@pages/administrative-boundary/application/use-cases/regions/departments-by-region-id.use-case';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdHandler {
    private readonly useCase = inject(DepartmentsByRegionIdUseCase);

    execute(
        command: DepartmentsByRegionIdQuery,
        page: string,
        options?: FetchOptions
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
            page,
            options
        );
    }
}
