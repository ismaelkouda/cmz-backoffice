import { MessagingEnableCommand } from '@pages/communication/application/commands/messaging/messaging-enable.command';
import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';

export function messagingEnableCommandMapper(
    command: MessagingEnableCommand
): MessagingEnableDto {
    return {
        uniqId: command.uniqId,
    };
}
