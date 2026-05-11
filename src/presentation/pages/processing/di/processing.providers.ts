import { inject, Provider } from '@angular/core';
import { provideAll } from '@pages/processing/di/all/all.providers';
import { provideDetails } from '@pages/processing/di/details/details.providers';
import { provideQueues } from '@pages/processing/di/queues/queues.providers';
import { provideTasksActionsType } from '@pages/processing/di/tasks/tasks-actions-type.providers';
import { provideTasksActions } from '@pages/processing/di/tasks/tasks-actions.providers';
import { provideTasks } from '@pages/processing/di/tasks/tasks.providers';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';

import { EnvService } from '../../../../core/config/env.service';

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
    ...provideTasksActionsType,
];
