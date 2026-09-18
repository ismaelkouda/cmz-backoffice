import { allQueryMapper } from '@pages/report-states/application/queries-mappers/all/all.mapper';
import { Injectable, inject } from '@angular/core';
import { AllQuery } from '@pages/report-states/application/queries/all/all.query';
import { AllUseCase } from '@pages/report-states/application/use-cases/all/all.use-case';
import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { StatsDto as AllStatsDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';

@Injectable({ providedIn: 'root' })
export class AllHandler {
    private readonly useCase = inject(AllUseCase);

    execute(
        query: AllQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity, AllStatsDto>> {
        return this.useCase.execute(allQueryMapper(query), page, options);
    }
}
