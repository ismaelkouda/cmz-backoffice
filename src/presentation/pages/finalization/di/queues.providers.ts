import { Provider } from '@angular/core';
import { QueuesRepositoryImpl } from '../data/repositories/queues.repository.impl';
import { QueuesRepository } from '../domain/repositories/queues.repository';

export const provideQueues = (): Provider[] => [
    {
        provide: QueuesRepository,
        useClass: QueuesRepositoryImpl,
    },
];
