import { Provider } from '@angular/core';
import { TasksRepositoryImpl } from '../data/repositories/tasks.repository.impl';
import { TasksRepository } from '../domain/repositories/tasks.repository';

export const provideTasks = (): Provider[] => [
    {
        provide: TasksRepository,
        useClass: TasksRepositoryImpl,
    },
];
