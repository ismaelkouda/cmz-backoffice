import { Provider } from '@angular/core';
import { QueuesMapper } from '@presentation/pages/report-requests/data/mappers/queues.mapper';
import { QueuesRepositoryImpl } from '@presentation/pages/report-requests/data/repositories/queues.repository.impl';
import { QueuesApi } from '@presentation/pages/report-requests/data/sources/queues.api';
import { QueuesRepository } from '@presentation/pages/report-requests/domain/repositories/queues.repository';

export function provideQueues(): Provider[] {
    return [
        QueuesApi,
        QueuesMapper,
        QueuesRepositoryImpl,
        {
            provide: QueuesRepository,
            useExisting: QueuesRepositoryImpl,
        },
    ];
}
