import { Provider } from '@angular/core';

import { TasksRepository } from '@presentation/pages/requests/domain/repositories/tasks/tasks.repository';
import { TasksRepositoryImpl } from '@presentation/pages/requests/infrastructure/data/repositories/tasks/tasks.repository.impl';

export const provideTasks: Provider[] = [
    {
        provide: TasksRepository,
        useClass: TasksRepositoryImpl,
    },
];
