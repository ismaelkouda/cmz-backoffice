import { Provider } from '@angular/core';
import { TasksActionsRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions.repository';
import { TasksActionsRepositoryImpl } from '@pages/processing/infrastructure/data/repositories/tasks/tasks-actions.repository.impl';

export const provideTasksActions: Provider[] = [
    {
        provide: TasksActionsRepository,
        useClass: TasksActionsRepositoryImpl,
    },
];
