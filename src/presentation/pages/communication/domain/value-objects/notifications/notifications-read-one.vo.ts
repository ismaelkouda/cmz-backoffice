import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';

export function notificationsReadOneVo(
    dto: NotificationsReadOneDto
): NotificationsReadOneDto {
    return {
        uniqId: dto.uniqId,
    };
}
