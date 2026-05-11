import { inject, Provider } from '@angular/core';
import { chatbotFindOneProviders } from '@shared/components/management/di/chatbot/chatbot-find-one.providers';
import { chatbotProviders } from '@shared/components/management/di/chatbot/chatbot.providers';
import { MANAGEMENT_BASE_URL } from '@shared/components/management/infrastructure/api/management.base-url';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'management Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideManagement = (): Provider[] => [
    {
        provide: MANAGEMENT_BASE_URL,
        useFactory: getApiBaseUrl,
    },

    ...chatbotProviders,
    ...chatbotFindOneProviders,
];
