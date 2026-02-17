import { NotificationsFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsFilterApiDto } from '@presentation/pages/communication/infrastructure/api/dto/notifications/notifications-filter-api.dto';

export function NotificationsFilterMapper(
    vo: NotificationsFilterEntity
): NotificationsFilterApiDto {
    const params: NotificationsFilterApiDto = {} as NotificationsFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.type) {
        params.type = vo.type;
    }
    if (vo.period?.start) {
        params.start_date = vo.period.start;
    }
    if (vo.period?.end) {
        params.end_date = vo.period.end;
    }

    return params;
}
