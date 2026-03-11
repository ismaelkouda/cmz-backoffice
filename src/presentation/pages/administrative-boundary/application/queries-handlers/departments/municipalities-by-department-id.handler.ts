import { inject, Injectable } from '@angular/core';
import { MunicipalitiesByDepartmentIdQuery } from '@pages/administrative-boundary/application/queries/departments/municipalities-by-department-id.query';
import { MunicipalitiesByDepartmentIdUseCase } from '@pages/administrative-boundary/application/use-cases/departments/municipalities-by-department-id.use-case';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
