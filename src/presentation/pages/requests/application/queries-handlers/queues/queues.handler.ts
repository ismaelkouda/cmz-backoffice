import { Injectable, inject } from '@angular/core';
import { QueuesQuery } from '@pages/requests/application/queries/queues/queues.query';
import { QueuesUseCase } from '@pages/requests/application/use-cases/queues/queues.use-case';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesHandler {
    private readonly useCase = inject(QueuesUseCase);

    execute(
        query: QueuesQuery,
        page: string,
        options?: FetchOptions
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
            page,
            options
        );
    }
}
