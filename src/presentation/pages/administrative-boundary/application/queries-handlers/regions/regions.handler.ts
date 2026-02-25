import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { RegionsQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/regions.query';
import { RegionsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/regions/regions.use-case';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions.entity';

@Injectable({ providedIn: 'root' })
export class RegionsHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsQuery,
        page: string
    ): Observable<Paginate<RegionsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                department: command.department,
                municipality: command.municipality,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
