import { NotificationsFilterContract } from '@pages/communication/domain/contracts/notifications/notifications-filter.contract';
import { NotificationsFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-filter-api.dto';

export function notificationsFilterMapper(
    contract: NotificationsFilterContract
): NotificationsFilterApiDto {
    const params: NotificationsFilterApiDto = {} as NotificationsFilterApiDto;

    if (contract.search) {
        params.search = contract.search;
    }
    if (contract.type) {
        params.type = contract.type;
    }
    if (contract.startDate) {
        params.start_date = contract.startDate;
    }
    if (contract.endDate) {
        params.end_date = contract.endDate;
    }

    return params;
}
