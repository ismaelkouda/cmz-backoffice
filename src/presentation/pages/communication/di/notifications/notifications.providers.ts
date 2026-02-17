import { Provider } from '@angular/core';

import { NotificationsRepository } from '@presentation/pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsRepositoryImpl } from '@presentation/pages/communication/infrastructure/data/repositories/notifications/notifications-repository.impl';

export const notificationsProviders: Provider[] = [
    {
        provide: NotificationsRepository,
        useClass: NotificationsRepositoryImpl,
    },
];
