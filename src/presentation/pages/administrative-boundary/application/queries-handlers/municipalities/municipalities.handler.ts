import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesQuery } from '@presentation/pages/administrative-boundary/application/queries/municipalities/municipalities.query';
import { MunicipalitiesUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';
import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesQuery,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>> {
        return this.useCase.execute(
            {
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
