import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { provideAll } from '@presentation/pages/processing/di/all/all.providers';
import { provideDetails } from '@presentation/pages/processing/di/details/details.providers';
import { provideQueues } from '@presentation/pages/processing/di/queues/queues.providers';
import { provideTasksActions } from '@presentation/pages/processing/di/tasks/tasks-actions.providers';
import { provideTasks } from '@presentation/pages/processing/di/tasks/tasks.providers';
import { PROCESSING_BASE_URL } from '@presentation/pages/processing/infrastructure/api/processing.base-url';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'processing Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideProcessing = (): Provider[] => [
    {
        provide: PROCESSING_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...provideAll,
    ...provideQueues,
    ...provideDetails,
    ...provideTasks,
    ...provideTasksActions,
];
