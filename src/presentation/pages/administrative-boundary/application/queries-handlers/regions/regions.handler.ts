import { inject, Injectable } from '@angular/core';
import { RegionsQuery } from '@pages/administrative-boundary/application/queries/regions/regions.query';
import { RegionsUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions.use-case';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page,
            options
        );
    }
}
