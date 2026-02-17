import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { provideDetails } from '@presentation/pages/requests/di//details/details.providers';
import { provideAll } from '@presentation/pages/requests/di/all/all.providers';
import { provideQueues } from '@presentation/pages/requests/di/queues/queues.providers';
import { provideTasks } from '@presentation/pages/requests/di/tasks/tasks.providers';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/report-requests.base-url';

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
