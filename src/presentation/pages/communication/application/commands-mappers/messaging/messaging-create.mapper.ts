import { MessagingCreateCommand } from '@pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingCreateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.contract';

export function messagingCreateCommandMapper(
    command: MessagingCreateCommand
): MessagingCreateContract {
    return {
        reportId: command.reportId,
        type: command.type,
        targetType: command.targetType,
        region: command.region,
        department: command.department,
        municipality: command.municipality,
        channels: command.channels,
        subject: command.subject,
        content: command.content,
    };
}
