import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDeleteApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-delete-api.dto';

export function messagingDeleteMapper(
    dto: MessagingDeleteDto
): MessagingDeleteApiDto {
    const prams = {} as MessagingDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
