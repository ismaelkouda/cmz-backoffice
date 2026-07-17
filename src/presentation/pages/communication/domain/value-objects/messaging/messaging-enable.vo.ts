import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';

export function messagingEnableVo(dto: MessagingEnableDto): MessagingEnableDto {
    return {
        uniqId: dto.uniqId,
    };
}
