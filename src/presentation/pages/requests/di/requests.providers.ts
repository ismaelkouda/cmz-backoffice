import { Provider } from '@angular/core';
import { provideDetails } from '@pages/requests/di//details/details.providers';
import { provideAll } from '@pages/requests/di/all/all.providers';
import { provideQueues } from '@pages/requests/di/queues/queues.providers';
import { provideTasks } from '@pages/requests/di/tasks/tasks.providers';

export const provideRequests = (): Provider[] => [
    ...provideQueues,
    ...provideAll,
    ...provideTasks,
    ...provideDetails,
];
