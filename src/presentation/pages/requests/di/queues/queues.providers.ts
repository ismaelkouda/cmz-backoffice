import { Provider } from '@angular/core';
import { QueuesRepository } from '@pages/requests/domain/repositories/queues/queues.repository';
import { QueuesRepositoryImpl } from '@pages/requests/infrastructure/data/repositories/queues/queues.repository.impl';

export const provideQueues: Provider[] = [
    {
        provide: QueuesRepository,
        useClass: QueuesRepositoryImpl,
    },
];
