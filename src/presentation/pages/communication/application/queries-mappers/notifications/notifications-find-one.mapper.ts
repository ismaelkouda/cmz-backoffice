import { NotificationsFindOneQuery } from '@pages/communication/application/queries/notifications/notifications-find-one.query';
import { NotificationsFindOneFilterDto } from '@pages/communication/application/dto/notifications/notifications-find-one-filter.dto';

export function notificationsFindOneQueryMapper(
    query: NotificationsFindOneQuery
): NotificationsFindOneFilterDto {
    return {
        uniqId: query.uniqId,
    };
}
