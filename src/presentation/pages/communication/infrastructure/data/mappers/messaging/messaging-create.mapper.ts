import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingCreateApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-create-api.dto';

export function messagingCreateMapper(
    entity: MessagingCreateEntity
): MessagingCreateApiDto {
    const params: MessagingCreateApiDto = {} as MessagingCreateApiDto;

    if (entity.type) {
        params.type = entity.type;
    }
    if (entity.reportId) {
        params.report_uniq_id = entity.reportId;
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
