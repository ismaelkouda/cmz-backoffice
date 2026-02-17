import { Provider } from '@angular/core';

import { NotificationsFindOneRepository } from '@presentation/pages/communication/domain/repositories/notifications/notifications-find-one.repository';
import { NotificationsFindOneRepositoryImpl } from '@presentation/pages/communication/infrastructure/data/repositories/notifications/notifications-find-one-repository.impl';

export const notificationsFindOneProviders: Provider[] = [
    {
        provide: NotificationsFindOneRepository,
        useClass: NotificationsFindOneRepositoryImpl,
    },
];
