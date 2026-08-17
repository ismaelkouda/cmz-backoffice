import { queuesQueryMapper } from '@pages/processing/application/queries-mappers/queues/queues.mapper';
import { Injectable, inject } from '@angular/core';
import { QueuesQuery } from '@pages/processing/application/queries/queues/queues.query';
import { QueuesUseCase } from '@pages/processing/application/use-cases/queues/queues.use-case';
import { QueuesEntity } from '@pages/processing/domain/entities/queues/queues.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
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
