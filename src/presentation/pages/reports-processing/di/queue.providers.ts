import { Provider } from '@angular/core';
import { QueueRepositoryImpl } from '../data/repositories/queue.repository.impl';
import { QueueRepository } from '../domain/repositories/queue.repository';

export const provideQueue = (): Provider[] => [
    {
        provide: QueueRepository,
        useClass: QueueRepositoryImpl,
    },
];
