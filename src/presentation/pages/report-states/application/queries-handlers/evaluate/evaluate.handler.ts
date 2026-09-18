import { evaluateQueryMapper } from '@pages/report-states/application/queries-mappers/evaluate/evaluate.mapper';
import { Injectable, inject } from '@angular/core';
import { EvaluateQuery } from '@pages/report-states/application/queries/evaluate/evaluate.query';
import { EvaluateUseCase } from '@pages/report-states/application/use-cases/evaluate/evaluate.use-case';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { StatsDto as EvaluateStatsDto } from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-response-api.dto';

@Injectable({ providedIn: 'root' })
export class EvaluateHandler {
    private readonly useCase = inject(EvaluateUseCase);

    execute(
        query: EvaluateQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity, EvaluateStatsDto>> {
        return this.useCase.execute(evaluateQueryMapper(query), page, options);
    }
}
