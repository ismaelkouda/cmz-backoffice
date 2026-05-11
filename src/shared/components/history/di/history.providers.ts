import { inject, Provider } from '@angular/core';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-find-one-repository';
import { HistoryRepository } from '@shared/components/history/domain/repositories/history.repository';
import { HISTORY_BASE_URL } from '@shared/components/history/infrastructure/api/history.base-url';
import { HistoryFindOneRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history-find-one-repository.impl';
import { HistoryRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history.repository.impl';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'History Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const historyProviders = (): Provider[] => [
    {
        provide: HISTORY_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    {
        provide: HistoryRepository,
        useClass: HistoryRepositoryImpl,
    },
    {
        provide: HistoryFindOneRepository,
        useClass: HistoryFindOneRepositoryImpl,
    },
];
