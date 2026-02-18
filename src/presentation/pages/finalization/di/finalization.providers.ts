import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { provideAll } from '@presentation/pages/finalization/di/all/all.providers';
import { provideDetails } from '@presentation/pages/finalization/di/details/details.providers';
import { provideQueues } from '@presentation/pages/finalization/di/queues/queues.providers';
import { provideTasks } from '@presentation/pages/finalization/di/tasks/tasks.providers';
import { FINALIZATION_BASE_URL } from '@presentation/pages/finalization/infrastructure/api/finalization.base-url';

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
