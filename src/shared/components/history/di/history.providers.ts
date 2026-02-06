import { Provider } from '@angular/core';
import { inject } from '@angular/core';

import { EnvService } from '@shared/services/env.service';

import { HistoryRepository } from '../core/domain/repositories/history.repository';
import { HISTORY_BASE_URL } from '../infrastructure/api/history.base-url';
import { HistoryRepositoryImpl } from '../infrastructure/data/repositories/history.repository.impl';

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
];
