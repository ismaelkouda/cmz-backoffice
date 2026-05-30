import { Injectable, inject } from '@angular/core';
import { EvaluateQuery } from '@pages/report-states/application/queries/evaluate/evaluate.query';
import { EvaluateHandler } from '@pages/report-states/application/queries-handlers/evaluate/evaluate.handler';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluateBus {
    private readonly filterHandler = inject(EvaluateHandler);

    dispatch<T>(query: T, page: string): Observable<Paginate<EvaluateEntity>> {
        if (query instanceof EvaluateQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
