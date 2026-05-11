import { inject, Provider } from '@angular/core';
import { provideAll } from '@pages/finalization/di/all/all.providers';
import { provideDetails } from '@pages/finalization/di/details/details.providers';
import { provideQueues } from '@pages/finalization/di/queues/queues.providers';
import { provideTasks } from '@pages/finalization/di/tasks/tasks.providers';
import { FINALIZATION_BASE_URL } from '@pages/finalization/infrastructure/api/finalization.base-url';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'finalization Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideFinalization = (): Provider[] => [
    {
        provide: FINALIZATION_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...provideAll,
    ...provideQueues,
    ...provideDetails,
    ...provideTasks,
];
