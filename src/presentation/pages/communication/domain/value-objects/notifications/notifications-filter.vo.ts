import { NotificationsFilterContract } from '@presentation/pages/communication/domain/contracts/notifications/notifications-filter.contract';
import { validateNotificationsFilter } from '@presentation/pages/communication/domain/validators/notifications/notifications-filter.validator';

export function notificationsFilterVo(
    contract: NotificationsFilterContract
): NotificationsFilterContract {
    validateNotificationsFilter(contract);
    return contract;
}
