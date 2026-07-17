import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingDisableApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-disable-api.dto';

export function messagingDisableMapper(
    dto: MessagingDisableDto
): MessagingDisableApiDto {
    const prams = {} as MessagingDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
