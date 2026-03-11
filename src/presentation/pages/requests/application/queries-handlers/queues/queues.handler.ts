import { Injectable } from '@angular/core';
import { QueuesQuery } from '@pages/requests/application/queries/queues/queues.query';
import { QueuesUseCase } from '@pages/requests/application/use-cases/queues/queues.use-case';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
