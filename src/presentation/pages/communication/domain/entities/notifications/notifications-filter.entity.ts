import { NotificationsFilterContract } from '@presentation/pages/communication/domain/contracts/notifications/notifications-filter.contract';

export function notificationsFilterEntity(
    contract: NotificationsFilterContract
): NotificationsFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
