import { Provider } from '@angular/core';
import { messagingFindOneProviders } from '@pages/communication/di/messaging/messaging-find-one.providers';
import { messagingProviders } from '@pages/communication/di/messaging/messaging.providers';
import { notificationsFindOneProviders } from '@pages/communication/di/notifications/notifications-find-one.providers';
import { notificationsProviders } from '@pages/communication/di/notifications/notifications.providers';

export const provideCommunication = (): Provider[] => [
    ...notificationsProviders,
    ...notificationsFindOneProviders,
    ...messagingProviders,
    ...messagingFindOneProviders,
];
