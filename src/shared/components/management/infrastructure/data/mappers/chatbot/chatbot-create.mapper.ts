import { ChatbotCreateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-create.entity';
import { ChatbotCreateApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-create-api.dto';

export function chatbotCreateMapper(
    entity: ChatbotCreateEntity
): ChatbotCreateApiDto {
    const params: ChatbotCreateApiDto = {} as ChatbotCreateApiDto;

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
        params.region_id = entity.region;
    }
    if (entity.department) {
        params.department_id = entity.department;
    }
    if (entity.municipality) {
        params.municipality_id = entity.municipality;
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
