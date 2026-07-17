import { MessagingDisableCommand } from '@pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';

export function messagingDisableCommandMapper(
    command: MessagingDisableCommand
): MessagingDisableDto {
    return {
        uniqId: command.uniqId,
    };
}
