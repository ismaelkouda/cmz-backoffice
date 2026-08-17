import { Provider } from '@angular/core';
import { QueuesRepository } from '@pages/processing/domain/repositories/queues/queues.repository';
import { QueuesRepositoryImpl } from '@pages/processing/infrastructure/data/repositories/queues/queues.repository.impl';

export const provideQueues: Provider[] = [
    {
        provide: QueuesRepository,
        useClass: QueuesRepositoryImpl,
    },
];
