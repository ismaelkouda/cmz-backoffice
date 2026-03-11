import { inject, Provider } from '@angular/core';
import { provideDetails } from '@pages/requests/di//details/details.providers';
import { provideAll } from '@pages/requests/di/all/all.providers';
import { provideQueues } from '@pages/requests/di/queues/queues.providers';
import { provideTasks } from '@pages/requests/di/tasks/tasks.providers';
import { REQUESTS_BASE_URL } from '@pages/requests/infrastructure/api/report-requests.base-url';
import { EnvService } from '@shared/domain/services/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'report-requests Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideRequests = (): Provider[] => [
    {
        provide: REQUESTS_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...provideQueues,
    ...provideAll,
    ...provideTasks,
    ...provideDetails,
];
