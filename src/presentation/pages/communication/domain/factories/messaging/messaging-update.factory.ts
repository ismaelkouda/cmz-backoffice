import { MessagingUpdateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.validate-contract';
import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';

export function messagingUpdateFactory(
    contract: MessagingUpdateValidateContract
): MessagingUpdateEntity {
    return new MessagingUpdateEntity(contract);
}
