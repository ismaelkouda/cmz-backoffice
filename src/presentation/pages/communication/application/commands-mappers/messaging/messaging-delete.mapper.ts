import { MessagingDeleteCommand } from '@pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';

export function messagingDeleteCommandMapper(
    command: MessagingDeleteCommand
): MessagingDeleteDto {
    return {
        uniqId: command.uniqId,
    };
}
