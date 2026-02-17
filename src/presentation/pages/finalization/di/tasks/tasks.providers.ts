import { Provider } from '@angular/core';

import { TasksRepository } from '@presentation/pages/finalization/domain/repositories/tasks/tasks.repository';
import { TasksRepositoryImpl } from '@presentation/pages/finalization/infrastructure/data/repositories/tasks/tasks.repository.impl';

export const provideTasks: Provider[] = [
    {
        provide: TasksRepository,
        useClass: TasksRepositoryImpl,
    },
];
