import { Injectable, inject } from '@angular/core';
import { EvaluateQuery } from '@pages/report-states/application/queries/evaluate/evaluate.query';
import { EvaluateUseCase } from '@pages/report-states/application/use-cases/evaluate/evaluate.use-case';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluateHandler {
    private readonly useCase = inject(EvaluateUseCase);

    execute(
        query: EvaluateQuery,
        page: string
    ): Observable<Paginate<EvaluateEntity>> {
        return this.useCase.execute(
            {
                initiatorPhoneNumber: query.initiatorPhoneNumber,
                uniqId: query.uniqId,
                reportType: query.reportType,
                operators: query.operators,
                source: query.source,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
