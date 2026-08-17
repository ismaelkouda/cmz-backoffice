import { NotificationsFindOneFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one-filter.entity';
import { NotificationsFindOneFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-find-one-filter-api.dto';

export function agentsPerformancesFindOneFilterMapper(
    entity: NotificationsFindOneFilterEntity
): NotificationsFindOneFilterApiDto {
    return {
        uniq_id: entity.uniqId ?? '',
    };
}
