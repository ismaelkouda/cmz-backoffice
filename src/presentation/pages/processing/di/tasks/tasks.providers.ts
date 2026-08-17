import { Provider } from '@angular/core';
import { TasksRepository } from '@pages/processing/domain/repositories/tasks/tasks.repository';
import { TasksRepositoryImpl } from '@pages/processing/infrastructure/data/repositories/tasks/tasks.repository.impl';

export const provideTasks: Provider[] = [
    {
        provide: TasksRepository,
        useClass: TasksRepositoryImpl,
    },
];
