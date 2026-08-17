import { Provider } from '@angular/core';
import { TasksActionsTypeRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions-type-repository';
import { TasksActionsTypeRepositoryImpl } from '@pages/processing/infrastructure/data/repositories/tasks/tasks-actions-type-repository.impl';

export const provideTasksActionsType: Provider[] = [
    {
        provide: TasksActionsTypeRepository,
        useClass: TasksActionsTypeRepositoryImpl,
    },
];
