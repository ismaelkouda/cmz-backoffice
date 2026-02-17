import { Provider } from '@angular/core';

import { QueuesRepository } from '@presentation/pages/finalization/domain/repositories/queues/queues.repository';
import { QueuesRepositoryImpl } from '@presentation/pages/finalization/infrastructure/data/repositories/queues/queues.repository.impl';

export const provideQueues: Provider[] = [
    {
        provide: QueuesRepository,
        useClass: QueuesRepositoryImpl,
    },
];
