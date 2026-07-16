import { Provider } from '@angular/core';
import { provideAll } from '@pages/finalization/di/all/all.providers';
import { provideDetails } from '@pages/finalization/di/details/details.providers';
import { provideQueues } from '@pages/finalization/di/queues/queues.providers';
import { provideTasks } from '@pages/finalization/di/tasks/tasks.providers';

export const provideFinalization = (): Provider[] => [
    ...provideAll,
    ...provideQueues,
    ...provideDetails,
    ...provideTasks,
];
