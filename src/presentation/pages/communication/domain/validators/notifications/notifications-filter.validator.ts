import { NotificationsFilterContract } from '@presentation/pages/communication/domain/contracts/notifications/notifications-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateNotificationsFilter(
    contract: NotificationsFilterContract
): asserts contract is NotificationsFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
