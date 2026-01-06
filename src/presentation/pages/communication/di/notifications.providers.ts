import { Provider } from '@angular/core';
import { NotificationsRepositoryImpl } from '../data/repositories/notifications.repository.impl';
import { NotificationsRepository } from '../domain/repositories/notifications.repository';

export function provideNotifications(): Provider[] {
    return [
        {
            provide: NotificationsRepository,
            useExisting: NotificationsRepositoryImpl,
        },
    ];
}
