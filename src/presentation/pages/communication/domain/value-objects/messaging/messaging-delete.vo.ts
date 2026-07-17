import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';

export function messagingDeleteVo(dto: MessagingDeleteDto): MessagingDeleteDto {
    return {
        uniqId: dto.uniqId,
    };
}
