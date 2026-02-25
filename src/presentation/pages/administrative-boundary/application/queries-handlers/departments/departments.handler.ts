import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsQuery } from '@presentation/pages/administrative-boundary/application/queries/departments/departments.query';
import { DepartmentsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/departments/departments.use-case';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';

@Injectable({ providedIn: 'root' })
export class DepartmentsHandler {
    private readonly useCase = inject(DepartmentsUseCase);

    execute(
        command: DepartmentsQuery,
        page: string
    ): Observable<Paginate<DepartmentsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                region: command.region,
                municipality: command.municipality,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
