import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesByDepartmentIdQuery } from '@presentation/pages/administrative-boundary/application/queries/departments/municipalities-by-department-id.query';
import { MunicipalitiesByDepartmentIdUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/departments/municipalities-by-department-id.use-case';
import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdHandler {
    private readonly useCase = inject(MunicipalitiesByDepartmentIdUseCase);

    execute(
        command: MunicipalitiesByDepartmentIdQuery,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        return this.useCase.execute(
            {
                uniqId: command.uniqId,
                search: command.search,
                region: command.region,
                department: command.department,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
