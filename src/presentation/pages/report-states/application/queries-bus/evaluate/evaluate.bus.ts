import { Injectable, inject } from '@angular/core';
import { EvaluateQuery } from '@pages/report-states/application/queries/evaluate/evaluate.query';
import { EvaluateHandler } from '@pages/report-states/application/queries-handlers/evaluate/evaluate.handler';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { StatsDto as EvaluateStatsDto } from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-response-api.dto';

@Injectable({ providedIn: 'root' })
export class EvaluateBus {
    private readonly filterHandler = inject(EvaluateHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity, EvaluateStatsDto>> {
        if (query instanceof EvaluateQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
