/* import { Provider } from '@angular/core';
import { NotificationsMapper } from '../data/mappers/notifications.mapper';
import { NotificationsRepositoryImpl } from '../data/repositories/notifications.repository.impl';
import { NotificationsApi } from '../data/sources/notifications.api';
import { NotificationsRepository } from '../domain/repositories/notifications.repository';

export function provideNotifications(): Provider[] {
    return [
        NotificationsApi,
        NotificationsMapper,
        NotificationsRepositoryImpl,
        {
            provide: NotificationsRepository,
            useExisting: NotificationsRepositoryImpl,
        },
    ];
}
 */
