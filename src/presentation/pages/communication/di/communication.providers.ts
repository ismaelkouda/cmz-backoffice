import { inject, Provider } from '@angular/core';
import { messagingFindOneProviders } from '@pages/communication/di/messaging/messaging-find-one.providers';
import { messagingProviders } from '@pages/communication/di/messaging/messaging.providers';
import { notificationsFindOneProviders } from '@pages/communication/di/notifications/notifications-find-one.providers';
import { notificationsProviders } from '@pages/communication/di/notifications/notifications.providers';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';

import { EnvService } from '../../../../core/config/env.service';

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
