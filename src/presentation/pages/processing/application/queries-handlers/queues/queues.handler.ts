import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { QueuesQuery } from '@presentation/pages/processing/application/queries/queues/queues.query';
import { QueuesUseCase } from '@presentation/pages/processing/application/use-cases/queues/queues.use-case';
import { QueuesEntity } from '@presentation/pages/processing/domain/entities/queues/queues.entity';

@Injectable({ providedIn: 'root' })
export class QueuesHandler {
    constructor(private readonly useCase: QueuesUseCase) {}

    execute(
        query: QueuesQuery,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
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
