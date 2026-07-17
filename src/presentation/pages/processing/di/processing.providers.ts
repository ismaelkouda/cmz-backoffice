import { Provider } from '@angular/core';
import { provideAll } from '@pages/processing/di/all/all.providers';
import { provideDetails } from '@pages/processing/di/details/details.providers';
import { provideQueues } from '@pages/processing/di/queues/queues.providers';
import { provideTasksActionsType } from '@pages/processing/di/tasks/tasks-actions-type.providers';
import { provideTasksActions } from '@pages/processing/di/tasks/tasks-actions.providers';
import { provideTasks } from '@pages/processing/di/tasks/tasks.providers';

export const provideProcessing = (): Provider[] => [
    ...provideAll,
    ...provideQueues,
    ...provideDetails,
    ...provideTasks,
    ...provideTasksActions,
    ...provideTasksActionsType,
];
