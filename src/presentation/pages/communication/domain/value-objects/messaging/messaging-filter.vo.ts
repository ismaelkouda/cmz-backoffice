import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import { validateMessagingFilter } from '@presentation/pages/communication/domain/validators/messaging/messaging-filter.validator';

export function messagingFilterVo(
    contract: MessagingFilterContract
): MessagingFilterContract {
    validateMessagingFilter(contract);
    return contract;
}
