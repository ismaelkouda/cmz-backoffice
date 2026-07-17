import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';
import { NotificationsReadOneApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-read-one-api.dto';

export function notificationsReadOneMapper(
    dto: NotificationsReadOneDto
): NotificationsReadOneApiDto {
    const prams = {} as NotificationsReadOneApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
