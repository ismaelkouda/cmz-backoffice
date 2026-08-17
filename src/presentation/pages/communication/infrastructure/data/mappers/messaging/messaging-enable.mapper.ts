import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';
import { MessagingEnableApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-enable-api.dto';

export function messagingEnableMapper(
    dto: MessagingEnableDto
): MessagingEnableApiDto {
    const prams = {} as MessagingEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
