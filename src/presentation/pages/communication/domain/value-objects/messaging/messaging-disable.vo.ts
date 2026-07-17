import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';

export function messagingDisableVo(
    dto: MessagingDisableDto
): MessagingDisableDto {
    return {
        uniqId: dto.uniqId,
    };
}
