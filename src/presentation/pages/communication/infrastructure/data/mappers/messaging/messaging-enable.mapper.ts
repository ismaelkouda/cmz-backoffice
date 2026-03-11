import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingEnableApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-enable-api.dto';

export function messagingEnableMapper(
    vo: MessagingEnableEntity
): MessagingEnableApiDto {
    const prams = {} as MessagingEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
