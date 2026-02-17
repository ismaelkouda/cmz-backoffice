import { Provider } from '@angular/core';

import { TasksActionsRepository } from '@presentation/pages/processing/domain/repositories/tasks/tasks-actions.repository';
import { TasksActionsRepositoryImpl } from '@presentation/pages/processing/infrastructure/data/repositories/tasks/tasks-actions.repository.impl';

export const provideTasksActions: Provider[] = [
    {
        provide: TasksActionsRepository,
        useClass: TasksActionsRepositoryImpl,
    },
];
