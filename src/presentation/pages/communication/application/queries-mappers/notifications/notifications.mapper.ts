import { NotificationsQuery } from '@pages/communication/application/queries/notifications/notifications.query';
import { NotificationsFilterDto } from '@pages/communication/application/dto/notifications/notifications-filter.dto';

export function notificationsQueryMapper(
    query: NotificationsQuery
): NotificationsFilterDto {
    return {
        search: query.search,
        type: query.type,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
