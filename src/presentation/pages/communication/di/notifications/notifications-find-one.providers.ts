import { Provider } from '@angular/core';
import { NotificationsFindOneRepository } from '@pages/communication/domain/repositories/notifications/notifications-find-one.repository';
import { NotificationsFindOneRepositoryImpl } from '@pages/communication/infrastructure/data/repositories/notifications/notifications-find-one-repository.impl';

export const notificationsFindOneProviders: Provider[] = [
    {
        provide: NotificationsFindOneRepository,
        useClass: NotificationsFindOneRepositoryImpl,
    },
];
