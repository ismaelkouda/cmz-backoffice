import { MessagingCreateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.contract';
import { MessagingCreateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.validate-contract';
import { validateMessagingCreate } from '@presentation/pages/communication/domain/validators/messaging/messaging-create.validator';

export function messagingCreateVo(
    contract: MessagingCreateContract
): MessagingCreateValidateContract {
    validateMessagingCreate(contract);
    return {
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
