import { MessagingUpdateCommand } from '@pages/communication/application/commands/messaging/messaging-update.command';
import { MessagingUpdateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.contract';

export function messagingUpdateCommandMapper(
    command: MessagingUpdateCommand
): MessagingUpdateContract {
    return {
        uniqId: command.uniqId,
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
