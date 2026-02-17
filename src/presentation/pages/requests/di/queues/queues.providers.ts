import { Provider } from '@angular/core';

import { QueuesRepository } from '@presentation/pages/requests/domain/repositories/queues/queues.repository';
import { QueuesRepositoryImpl } from '@presentation/pages/requests/infrastructure/data/repositories/queues/queues.repository.impl';

export const provideQueues: Provider[] = [
    {
        provide: QueuesRepository,
        useClass: QueuesRepositoryImpl,
    },
];
