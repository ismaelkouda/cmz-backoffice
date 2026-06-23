import { MessagingUpdateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.contract';
import { MessagingUpdateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.validate-contract';
import { validateMessagingUpdate } from '@presentation/pages/communication/domain/validators/messaging/messaging-update.validator';

export function messagingUpdateVo(
    contract: MessagingUpdateContract
): MessagingUpdateValidateContract {
    validateMessagingUpdate(contract);
    return {
        uniqId: contract.uniqId,
        reportId: contract.reportId,
        type: contract.type,
        targetType: contract.targetType,
        region: contract.region,
        department: contract.department,
        municipality: contract.municipality,
        channels: contract.channels,
        subject: contract.subject,
        content: contract.content,
    };
}
