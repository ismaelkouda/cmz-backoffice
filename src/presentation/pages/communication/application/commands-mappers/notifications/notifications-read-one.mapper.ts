import { NotificationsReadOneCommand } from '@pages/communication/application/commands/notifications/notifications-read-one.command';
import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';

export function notificationsReadOneCommandMapper(
    command: NotificationsReadOneCommand
): NotificationsReadOneDto {
    return {
        uniqId: command.uniqId,
    };
}
