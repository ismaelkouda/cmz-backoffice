import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { messagingFindOneProviders } from '@presentation/pages/communication/di/messaging/messaging-find-one.providers';
import { messagingProviders } from '@presentation/pages/communication/di/messaging/messaging.providers';
import { notificationsFindOneProviders } from '@presentation/pages/communication/di/notifications/notifications-find-one.providers';
import { notificationsProviders } from '@presentation/pages/communication/di/notifications/notifications.providers';
import { COMMUNICATION_BASE_URL } from '@presentation/pages/communication/infrastructure/api/communication.base-url';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'communication Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideCommunication = (): Provider[] => [
    {
        provide: COMMUNICATION_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...notificationsProviders,
    ...notificationsFindOneProviders,

    ...messagingProviders,
    ...messagingFindOneProviders,
];
