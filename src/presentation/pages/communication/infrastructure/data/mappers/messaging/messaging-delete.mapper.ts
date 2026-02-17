import { MessagingDeleteEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDeleteApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-delete-api.dto';

export function messagingDeleteMapper(
    vo: MessagingDeleteEntity
): MessagingDeleteApiDto {
    const prams = {} as MessagingDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
