import { MessagingFindOneFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneFilterApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-filter-api.dto';

export function messagingFindOneFilterMapper(
    entity: MessagingFindOneFilterEntity
): MessagingFindOneFilterApiDto {
    const params: MessagingFindOneFilterApiDto =
        {} as MessagingFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
