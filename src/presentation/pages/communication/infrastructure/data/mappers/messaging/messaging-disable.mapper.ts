import { MessagingDisableEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingDisableApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-disable-api.dto';

export function messagingDisableMapper(
    vo: MessagingDisableEntity
): MessagingDisableApiDto {
    const prams = {} as MessagingDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
