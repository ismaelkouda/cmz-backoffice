import { inject, Injectable } from '@angular/core';
import { DepartmentsQuery } from '@pages/administrative-boundary/application/queries/departments/departments.query';
import { DepartmentsUseCase } from '@pages/administrative-boundary/application/use-cases/departments/departments.use-case';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
