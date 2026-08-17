import { queuesQueryMapper } from '@pages/finalization/application/queries-mappers/queues/queues.mapper';
import { Injectable, inject } from '@angular/core';
import { QueuesQuery } from '@pages/finalization/application/queries/queues/queues.query';
import { QueuesUseCase } from '@pages/finalization/application/use-cases/queues/queues.use-case';
import { QueuesEntity } from '@pages/finalization/domain/entities/queues/queues.entity';
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
        return this.useCase.execute(queuesQueryMapper(query), page, options);
    }
}
