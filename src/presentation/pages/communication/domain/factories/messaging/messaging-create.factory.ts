import { MessagingCreateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.validate-contract';
import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';

export function messagingCreateFactory(
    contract: MessagingCreateValidateContract
): MessagingCreateEntity {
    // const normalizedSubject = contract.subject.trim();
    return new MessagingCreateEntity(contract);
}
