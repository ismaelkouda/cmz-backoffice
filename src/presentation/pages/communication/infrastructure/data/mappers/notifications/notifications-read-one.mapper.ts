import { NotificationsReadOneEntity } from '@pages/communication/domain/entities/notifications/notifications-read-one.entity';
import { NotificationsReadOneApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-read-one-api.dto';

export function notificationsReadOneMapper(
    vo: NotificationsReadOneEntity
): NotificationsReadOneApiDto {
    const prams = {} as NotificationsReadOneApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
