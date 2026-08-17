import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateMessagingFilter(
    contract: MessagingFilterContract
): asserts contract is MessagingFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
