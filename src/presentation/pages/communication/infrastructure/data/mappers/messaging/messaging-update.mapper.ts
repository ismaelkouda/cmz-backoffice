import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingUpdateApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-update-api.dto';

export function messagingUpdateMapper(
    entity: MessagingUpdateEntity
): MessagingUpdateApiDto {
    const params: MessagingUpdateApiDto = {} as MessagingUpdateApiDto;

    if (entity.reportId) {
        params.report_uniq_id = entity.reportId;
    }
    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.type) {
        params.type = entity.type;
    }
    if (entity.targetType) {
        params.target_type = entity.targetType;
    }
    if (entity.region) {
        params.region = entity.region;
    }
    if (entity.department) {
        params.department = entity.department;
    }
    if (entity.municipality) {
        params.municipality = entity.municipality;
    }
    if (entity.channels) {
        params.channels = entity.channels;
    }
    if (entity.subject) {
        params.subject = entity.subject;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}
